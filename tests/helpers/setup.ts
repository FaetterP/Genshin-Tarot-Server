import WebSocket from "ws";
import { startGameWSS, stopGameWSS, getAllClients, cycleController } from "../../src/ws/gameWSS";
import { startAdminWSS, stopAdminWSS } from "../../src/ws/adminWSS";
import { TaskAwaiter } from "../../src/utils/TaskAwaiter";
import { ECard, ECharacter, EEnemy } from "../../src/types/enums";
import type { CardPrimitive, EnemyPrimitive } from "../../src/types/general";

export const TEST_GAME_PORT = 19999;
export const TEST_ADMIN_PORT = 19998;

const DEFAULT_CHARACTERS: ECharacter[] = [
  ECharacter.Aether,
  ECharacter.Amber,
  ECharacter.Diluc,
  ECharacter.Bennett,
];

type Waiter = {
  predicate: (msg: unknown) => boolean;
  resolve: (msg: unknown) => void;
  reject: (err: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
};

export class GameTestClient {
  ws!: WebSocket;
  playerId!: string;
  startCycleData!: { you: any; otherPlayers: any[]; cycle: number; steps: any[] };

  private buffer: unknown[] = [];
  private waiters: Waiter[] = [];

  get hand(): CardPrimitive[] {
    return this.startCycleData?.you?.hand ?? [];
  }

  get deck(): CardPrimitive[] {
    return this.startCycleData?.you?.deck ?? [];
  }

  get enemies(): EnemyPrimitive[] {
    return this.startCycleData?.you?.enemies ?? [];
  }

  findCard(name: ECard): CardPrimitive | undefined {
    return this.hand.find((c) => c.name === name) || this.deck.find((c) => c.name === name);
  }

  async connect(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(`ws://localhost:${TEST_GAME_PORT}`);
      this.ws.on("open", resolve);
      this.ws.on("error", reject);
      this.ws.on("message", (data: Buffer) => {
        const msg = JSON.parse(data.toString());
        if ("taskId" in msg) {
          this.ws.send(JSON.stringify({ action: "task.completeTask", taskId: msg.taskId }));
        }
        this._dispatch(msg);
      });
      this.ws.on("close", () => {
        const error = new Error("WebSocket closed");
        for (const waiter of this.waiters) {
          clearTimeout(waiter.timeoutId);
          waiter.reject(error);
        }
        this.waiters = [];
      });
    });

    const connectMsg = (await this.waitFor((m: any) => m.action === "ws.connect")) as any;
    this.playerId = connectMsg.youPlayerId;
  }

  send(payload: object): void {
    this.ws.send(JSON.stringify(payload));
  }

  waitFor(predicate: (msg: unknown) => boolean, timeout = 5000): Promise<unknown> {
    const idx = this.buffer.findIndex(predicate);
    if (idx !== -1) {
      return Promise.resolve(this.buffer.splice(idx, 1)[0]);
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const i = this.waiters.findIndex((w) => w.resolve === resolve);
        if (i !== -1) this.waiters.splice(i, 1);
        reject(new Error("Timeout: no message matching predicate within " + timeout + "ms"));
      }, timeout);

      this.waiters.push({ predicate, resolve, reject, timeoutId });
    });
  }

  clearBuffer(): void {
    this.buffer = [];
  }

  close(): void {
    for (const waiter of this.waiters) {
      clearTimeout(waiter.timeoutId);
      waiter.reject(new Error("Client closed"));
    }
    this.waiters = [];
    if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
      this.ws.close();
    }
  }

  private _dispatch(msg: unknown): void {
    for (let i = 0; i < this.waiters.length; i++) {
      if (this.waiters[i].predicate(msg)) {
        clearTimeout(this.waiters[i].timeoutId);
        const { resolve } = this.waiters[i];
        this.waiters.splice(i, 1);
        resolve(msg);
        return;
      }
    }
    this.buffer.push(msg);
  }
}

export class AdminTestClient {
  ws!: WebSocket;

  private buffer: unknown[] = [];
  private waiters: Waiter[] = [];

  async connect(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(`ws://localhost:${TEST_ADMIN_PORT}`);
      this.ws.on("open", resolve);
      this.ws.on("error", reject);
      this.ws.on("message", (data: Buffer) => {
        const msg = JSON.parse(data.toString());
        this._dispatch(msg);
      });
      this.ws.on("close", () => {
        const error = new Error("Admin WebSocket closed");
        for (const waiter of this.waiters) {
          clearTimeout(waiter.timeoutId);
          waiter.reject(error);
        }
        this.waiters = [];
      });
    });

    await this.waitFor((m: any) => m.action === "admin.state");
  }

  async request(payload: object): Promise<void> {
    this.ws.send(JSON.stringify(payload));
    await this.waitFor((m: any) => m.status === "ok");
  }

  async updateEnemy(
    enemyId: string,
    stats: { hp?: number; shield?: number; isStunned?: boolean },
  ): Promise<void> {
    await this.request({ action: "admin.updateEnemy", enemyId, ...stats });
  }

  async updatePlayer(
    playerId: string,
    stats: {
      hp?: number;
      energy?: number;
      shield?: number;
      mora?: number;
      actionPoints?: { normal?: number; extra?: number };
    },
  ): Promise<void> {
    await this.request({ action: "admin.updatePlayer", playerId, ...stats });
  }

  async moveCard(
    playerId: string,
    cardId: string,
    from: "hand" | "discard" | "deck",
    to: "hand" | "discard" | "deck",
  ): Promise<void> {
    await this.request({ action: "admin.moveCard", playerId, cardId, from, to });
  }

  async addCard(
    playerId: string,
    cardName: ECard,
    to: "hand" | "discard" | "deck",
  ): Promise<void> {
    await this.request({ action: "admin.addCard", playerId, cardName, to });
  }

  async addEnemy(playerId: string, enemyName: EEnemy): Promise<void> {
    await this.request({ action: "admin.addEnemy", playerId, enemyName });
  }

  async removeEnemy(enemyId: string): Promise<void> {
    await this.request({ action: "admin.removeEnemy", enemyId });
  }

  waitFor(predicate: (msg: unknown) => boolean, timeout = 5000): Promise<unknown> {
    const idx = this.buffer.findIndex(predicate);
    if (idx !== -1) {
      return Promise.resolve(this.buffer.splice(idx, 1)[0]);
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const i = this.waiters.findIndex((w) => w.resolve === resolve);
        if (i !== -1) this.waiters.splice(i, 1);
        reject(new Error("Admin timeout: no message matching predicate within " + timeout + "ms"));
      }, timeout);

      this.waiters.push({ predicate, resolve, reject, timeoutId });
    });
  }

  close(): void {
    for (const waiter of this.waiters) {
      clearTimeout(waiter.timeoutId);
      waiter.reject(new Error("Admin client closed"));
    }
    this.waiters = [];
    if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
      this.ws.close();
    }
  }

  private _dispatch(msg: unknown): void {
    for (let i = 0; i < this.waiters.length; i++) {
      if (this.waiters[i].predicate(msg)) {
        clearTimeout(this.waiters[i].timeoutId);
        const { resolve } = this.waiters[i];
        this.waiters.splice(i, 1);
        resolve(msg);
        return;
      }
    }
    this.buffer.push(msg);
  }
}

export async function startTestServers(): Promise<void> {
  await startGameWSS(TEST_GAME_PORT);
  await startAdminWSS(TEST_ADMIN_PORT);
}

export async function stopTestServers(): Promise<void> {
  stopGameWSS();
  stopAdminWSS();
}

export function resetGame(): void {
  getAllClients().forEach((ws) => ws.terminate());
  cycleController.reset();
  TaskAwaiter.allTasks = [];
  TaskAwaiter.allAwaiters = [];
}

export interface TestGame {
  players: GameTestClient[];
  admin: AdminTestClient;
  cleanup: () => void;
}

async function addCharacters(player: GameTestClient, characters: ECharacter[]): Promise<void> {
  for (const character of characters) {
    player.send({ action: "characters.addCharacter", character });
    await player.waitFor((m: any) => m.status === "ok");
  }
}

export async function createTestGame(numPlayers = 1): Promise<TestGame> {
  const players: GameTestClient[] = [];

  for (let i = 0; i < numPlayers; i++) {
    const p = new GameTestClient();
    await p.connect();
    players.push(p);
  }

  for (const player of players) {
    await addCharacters(player, DEFAULT_CHARACTERS);
  }

  players[0].send({ action: "game.startGame" });

  await Promise.all(
    players.map(async (p) => {
      const msg = (await p.waitFor((m: any) => m.action === "game.startCycle")) as any;
      p.startCycleData = msg;
    }),
  );

  for (const player of players) {
    player.clearBuffer();
  }

  const admin = new AdminTestClient();
  await admin.connect();

  return {
    players,
    admin,
    cleanup: () => {
      for (const p of players) p.close();
      admin.close();
    },
  };
}

/**
 * Ensures the card is in the player's hand.
 * Moves from deck if possible, otherwise creates a new copy via admin.addCard.
 * Returns the cardId.
 */
export async function ensureCardInHand(
  player: GameTestClient,
  admin: AdminTestClient,
  cardName: ECard,
): Promise<string> {
  const inHand = player.hand.find((c) => c.name === cardName);
  if (inHand) return inHand.cardId;

  const inDeck = player.deck.find((c) => c.name === cardName);
  if (inDeck) {
    await admin.moveCard(player.playerId, inDeck.cardId, "deck", "hand");
    return inDeck.cardId;
  }

  await admin.addCard(player.playerId, cardName, "hand");
  const stateMsg = (await admin.waitFor((m: any) => m.action === "admin.state")) as any;
  const playerState = stateMsg.players?.find((p: any) => p.playerId === player.playerId);
  const added = playerState?.hand?.find((c: any) => c.name === cardName);
  if (!added) throw new Error(`Card ${cardName} was not found in hand after addCard`);
  return added.cardId;
}
