import type { DetailedStep } from "../types/detailedStep";
import { EDetailedStep, EEnemy, ELeyline } from "../types/enums";
import { CycleEndContext, CycleStartContext } from "../types/eventsContext";
import { ExtWebSocket } from "../types/wsTypes";
import { Event } from "../utils/Event";
import { sendToAll, sendToAllAndWait } from "../utils/wsUtils";
import { sendResponseToAdmin, getAllClients, getAllPlayers } from "../ws";
import { Player } from "./Player";
import { GameEndCycleResponse, GameEndTurnResponse } from "../types/response";
import type { LeylineEntry } from "../storage/enemies/BossEnemy";
import { BossEnemy } from "../storage/enemies/BossEnemy";
import { Dvalin } from "../storage/enemies/boss/Dvalin";

export class CycleController {
  private players: Player[] = [];
  private cycle: number = 0;
  private isGameStart: boolean = false;
  private boss: BossEnemy | null = null;
  private isBossDefeated: boolean = false;
  private nextLeylineOverride: ELeyline[] | null = null;

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
  public get Boss(): BossEnemy | null {
    return this.boss;
  }
  public get IsBossDefeated(): boolean {
    return this.isBossDefeated;
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
      removeListener: this.e_onCycleStart.RemoveListener.bind(this.e_onCycleStart),
    };
  }

  public spawnBoss(addToSteps: (data: DetailedStep[]) => void): void {
    if (this.boss || this.isBossDefeated) return;
    this.boss = new Dvalin(this.players.length);
    const boss = this.boss;
    boss.OnLoseLive.addListener(({ attackingPlayer }) => {
      boss.applyLoseLiveEffect(attackingPlayer, this.players);
    });
    this.boss.OnDeath.addListener(this.bossDeathHandler.bind(this));
    addToSteps([{ type: EDetailedStep.BossAppearance, boss: this.boss.getPrimitiveStats() }]);
  }

  private bossDeathHandler(): void {
    this.boss = null;
    this.isBossDefeated = true;
    sendToAll({ action: "game.win" });
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

  async startCycle(): Promise<void> {
    if (this.isBossDefeated) return;
    if (!this.boss && this.cycle > 12) return;

    const leylines: LeylineEntry[] = [];
    if (this.boss) {
      if (this.nextLeylineOverride !== null) {
        const override = this.nextLeylineOverride;
        this.nextLeylineOverride = null;
        for (const name of override) {
          leylines.push(this.boss.getLeylineByName(name));
        }
      } else {
        leylines.push(...this.boss.getCycleLeylines(this.cycle));
      }
    } else {
      this.nextLeylineOverride = null;
    }

    const steps: DetailedStep[] = [];
    for (const line of leylines) {
      for (const player of this.players) {
        player.setStepsCollector((data) => steps.push(...data));
      }
      line.use(this.players, (data) => steps.push(...data));
      for (const player of this.players) {
        player.setStepsCollector(null);
      }
      steps.push({ type: EDetailedStep.UseLeyline, name: line.name });
    }

    this.e_onCycleStart.Invoke({
      cycle: this.cycle,
      addToSteps: (data: DetailedStep[]) => {
        steps.push(...data);
      },
    });

    if (this.boss) {
      await this.boss.performOnStartCycle(this.players, (data) => steps.push(...data));
    }

    const bossPrimitive = this.boss?.getPrimitiveStats() ?? null;

    for (const ws of getAllClients()) {
      const you = (ws as ExtWebSocket).player;
      const data = {
        action: "game.startCycle",
        you: you.getPrimitiveStats(),
        otherPlayers: getAllPlayers().map((player) => player.getPrimitiveStats()),
        cycle: this.cycle,
        leylines: leylines.map((line) => line.name),
        steps,
        boss: bossPrimitive,
      };
      data.otherPlayers = data.otherPlayers.filter(
        (player) => player.playerId !== data.you?.playerId,
      );
      ws.send(JSON.stringify(data));
    }
    sendResponseToAdmin(
      {
        action: "game.startCycle",
        cycle: this.cycle,
        leylines: leylines.map((l) => l.name),
        stepsCount: steps.length,
      },
      "sendToAll",
    );
  }

  private async endCycle() {
    if (this.isBossDefeated) return;

    const steps: DetailedStep[] = [];

    this.e_onCycleEnd.Invoke({
      cycle: this.cycle,
      addToSteps: (data: DetailedStep[]) => {
        steps.push(...data);
      },
    });

    if (this.boss) {
      await this.boss.performOnEndPlayerPhase(this.players, (data) => steps.push(...data));
      await this.boss.performAttack(this.players, (data) => steps.push(...data));
      await this.boss.performOnEndEnemyPhase(this.players, (data) => steps.push(...data));
    }

    await sendToAllAndWait<GameEndCycleResponse>({
      action: "game.endCycle",
      steps,
    });

    this.cycle += 1;
    await this.startCycle();
  }

  playerEndTurn(player: Player, preSteps: DetailedStep[] = []) {
    const steps: DetailedStep[] = [...preSteps];
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
    if (this.boss?.ID === id) return this.boss;
    for (const player of this.players) {
      for (const enemy of player.Enemies) {
        if (enemy.ID === id) {
          return enemy;
        }
      }
    }
  }

  getPlayerByEnemyId(enemyId: string): Player | undefined {
    if (this.boss?.ID === enemyId) return undefined;
    for (const player of this.players) {
      if (player.Enemies.some((e) => e.ID === enemyId)) return player;
    }
    return undefined;
  }

  getPlayerCard(cardId: string, player: Player) {
    return player.Hand.find((card) => card.ID === cardId);
  }

  adminSetCycle(cycle: number) {
    this.cycle = Math.max(0, cycle);
  }

  adminSetGameStart(isGameStart: boolean) {
    this.isGameStart = isGameStart;
  }

  adminSetNextBossRoll(roll: number): void {
    this.boss?.setRollOverride(roll);
  }

  adminSetNextLeylines(leylines: ELeyline[]): void {
    this.nextLeylineOverride = leylines;
  }

  adminSpawnBoss(bossName: EEnemy): void {
    if (bossName !== EEnemy.Dvalin) throw new Error(`Unknown boss: ${bossName}`);
    this.spawnBoss(() => {});
  }

  reset(): void {
    this.players = [];
    this.cycle = 0;
    this.isGameStart = false;
    this.boss = null;
    this.isBossDefeated = false;
    this.nextLeylineOverride = null;
    this.e_onCycleEnd = new Event<CycleEndContext>();
    this.e_onCycleStart = new Event<CycleStartContext>();
  }
}
