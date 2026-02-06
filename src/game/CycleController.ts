import type { DetailedStep } from "../types/detailedStep";
import { CycleEndContext, CycleStartContext } from "../types/eventsContext";
import { ExtWebSocket } from "../types/wsTypes";
import { Event } from "../utils/Event";
import { sendToAll, sendToAllAndWait } from "../utils/wsUtils";
import { getAllClients, getAllPlayers } from "../ws";
import { Player } from "./Player";
import { getRandomEffect } from "./leylines";
import { GameEndCycleResponse, GameEndTurnResponse } from "../types/response";

export class CycleController {
  private players: Player[] = [];
  private cycle: number = 0;
  private isGameStart: boolean = false;

  private e_onCycleEnd = new Event<CycleEndContext>();
  private e_onCycleStart = new Event<CycleStartContext>();

  public get PlayersCount() {
    return this.players.length;
  }
  public get CycleNumber() {
    return this.cycle;
  }
  public get IsGameStart() {
    return this.isGameStart;
  }
  public get OnCycleEnd() {
    return {
      addListener: this.e_onCycleEnd.AddListener.bind(this.e_onCycleEnd),
      removeListener: this.e_onCycleEnd.RemoveListener.bind(this.e_onCycleEnd),
    };
  }
  public get OnCycleStart() {
    return {
      addListener: this.e_onCycleStart.AddListener.bind(this.e_onCycleStart),
      removeListener: this.e_onCycleStart.RemoveListener.bind(
        this.e_onCycleStart
      ),
    };
  }

  connectPlayer(player: Player) {
    if (this.players.length >= 4) {
      throw new Error("maximum players count");
    }

    if (this.players.includes(player)) {
      throw new Error("player already connected");
    }

    this.players.push(player);
  }

  startGame() {
    if (this.isGameStart) {
      throw new Error("game already started");
    }

    if (this.players.length === 0) {
      throw new Error("cannot start game without players");
    }

    for (const player of this.players) {
      if (player.Characters.length < 4) {
        throw new Error(`player ${player.ID} doesn't have 4 characters`);
      }
    }

    for (const player of this.players) {
      player.startGame();
    }

    this.isGameStart = true;
    this.cycle = 1;
  }

  startCycle(): void {
    if (this.cycle > 12) {
      // TODO
      return;
    }

    const countEffects = Math.floor(this.cycle / 3);
    const leylines: { name: string; use: (player: Player[]) => void }[] = [];

    for (let i = 0; i < countEffects; i++) {
      leylines.push(getRandomEffect());
    }

    const steps: DetailedStep[] = [];
    for (const line of leylines) {
      line.use(this.players);
      steps.push({ type: "use_leyline", name: line.name });
    }

    this.e_onCycleStart.Invoke({
      cycle: this.cycle,
      addToSteps: (data: DetailedStep[]) => {
        steps.push(...data);
      },
    });

    for (const ws of getAllClients()) {
      const you = (ws as ExtWebSocket).player;
      const data = {
        action: "game.startCycle",

        you: you.getPrimitiveStats(),
        otherPlayers: getAllPlayers().map((player) =>
          player.getPrimitiveStats()
        ),
        cycle: this.cycle,
        leylines: leylines.map((line) => line.name),
        steps,
      };
      data.otherPlayers = data.otherPlayers.filter(
        (player) => player.playerId !== data.you?.playerId
      );
      ws.send(JSON.stringify(data));
    }
  }

  private async endCycle() {
    const steps: DetailedStep[] = [];

    this.e_onCycleEnd.Invoke({
      cycle: this.cycle,
      addToSteps: (data: DetailedStep[]) => {
        steps.push(...data);
      },
    });

    await sendToAllAndWait<GameEndCycleResponse>({
      action: "game.endCycle",
      steps,
    });

    this.cycle += 1;
    this.startCycle();
  }

  playerEndTurn(player: Player) {
    const steps: DetailedStep[] = [];
    player.endTurn((data) => steps.push(...data));
    sendToAll<GameEndTurnResponse>({ action: "game.endTurn", playerID: player.ID, steps });

    if (this.players.find((p) => !p.IsTurnEnds)) {
      return;
    }

    this.endCycle();
  }

  getPlayers(): Player[] {
    return [...this.players];
  }

  getPlayerById(id: string) {
    return this.players.find((player) => player.ID === id);
  }

  getEnemyById(id: string) {
    for (const player of this.players) {
      for (const enemy of player.Enemies) {
        if (enemy.ID === id) {
          return enemy;
        }
      }
    }
  }

  getPlayerCard(cardId: string, player: Player) {
    return player.Hand.find((card) => card.ID === cardId);
  }
}
