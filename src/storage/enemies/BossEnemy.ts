import { Enemy } from "./Enemy";
import { Attack, BossPrimitive } from "../../types/general";
import { EDetailedStep, EElement, EEnemyEffect, ELeyline } from "../../types/enums";
import { Player } from "../../game/Player";
import type { DetailedStep } from "../../types/detailedStep";
import { Event } from "../../utils/Event";

type AddToSteps = (steps: DetailedStep[]) => void;

export type LeylineEntry = {
  use: (players: Player[], addToSteps: (steps: DetailedStep[]) => void) => void;
  name: ELeyline;
};

export abstract class BossEnemy extends Enemy {
  private lives: number;
  protected readonly leylinePool: LeylineEntry[] = [];
  protected nextRollOverride: number | null = null;

  private e_onLoseLive = new Event<{ attackingPlayer: Player }>();

  public get OnLoseLive() {
    return {
      addListener: this.e_onLoseLive.AddListener.bind(this.e_onLoseLive),
      removeListener: this.e_onLoseLive.RemoveListener.bind(this.e_onLoseLive),
    };
  }

  protected override checkAttackTarget(attack: Attack): void { }

  protected get Lives(): number {
    return this.lives;
  }

  abstract getStatsByPlayers(playerCount: number): { lives: number; hp: number; shield: number };

  constructor(stats: { lives: number; hp: number; shield: number }) {
    super({ hp: stats.hp, damage: 0, shield: stats.shield, mora: 0 });
    this.lives = stats.lives;
  }

  public getCycleLeylines(cycle: number): LeylineEntry[] {
    return [];
  }

  public getLeylineByName(name: ELeyline): LeylineEntry {
    const found = this.leylinePool.find((e) => e.name === name);
    if (!found) throw new Error(`Unknown leyline: ${name}`);
    return found;
  }

  public setRollOverride(roll: number): void {
    this.nextRollOverride = roll;
  }

  // ─── Lifecycle hooks ─────────────────────────────────────────────────────────
  //
  // Called by CycleController in this order each cycle:
  //
  //   startCycle()
  //     → performOnStartCycle   (boss passive at start of player phase)
  //
  //   endCycle() — after all players end turn:
  //     → performOnEndPlayerPhase   (boss passive triggered at end of player phase; Raiden: Catalyst)
  //     → performAttack             (d6 attack during enemy phase)
  //     → performOnEndEnemyPhase    (boss passive triggered at end of enemy phase; Oceanid: Rising Tides+)

  /** Boss passive at the start of the player phase (Dvalin: Unstable Platforms, Raiden: Ominous Destiny+). */
  public async performOnStartCycle(_players: Player[], _addToSteps: AddToSteps): Promise<void> {}

  /** Boss passive at the end of the player phase, before the attack (Raiden: Catalyst). */
  public async performOnEndPlayerPhase(_players: Player[], _addToSteps: AddToSteps): Promise<void> {}

  /** Boss d6 attack during the enemy phase. */
  public async performAttack(_players: Player[], _addToSteps: AddToSteps): Promise<void> {}

  /** Boss passive at the end of the enemy phase, after the attack (Oceanid: Rising Tides+). */
  public async performOnEndEnemyPhase(_players: Player[], _addToSteps: AddToSteps): Promise<void> {}

  /**
   * Called by CycleController when a boss loses a life but survives.
   * Steps should be added via `attackingPlayer.addSteps(...)` — they appear in the
   * game.useCard broadcast. Other players' state can be modified directly.
   * Override in subclasses for effects that target all players (Andrius, Azhdaha, etc.).
   */
  public applyLoseLiveEffect(_attackingPlayer: Player, _allPlayers: Player[]): void {}

  /**
   * Routes a player's WS response to the pending interactive action.
   * Called from game.ts whenever a boss-specific response action arrives.
   * Each boss overrides this to dispatch to its own pending choice maps.
   *
   * @param actionName  Identifies which interactive action this is a response for
   *                    (e.g. "dragonBreath", "bossPassive").
   * @param playerId    ID of the responding player.
   * @param payload     The payload, excluding taskId.
   */
  public receivePlayerAction(_actionName: string, _playerId: string, _payload: Record<string, any>): void {}

  /** Apply damage to all players, generating shield/HP/EnemyAttack steps. */
  protected applyDamageToAll(players: Player[], damage: number, isPiercing: boolean, addToSteps: AddToSteps): void {
    for (const player of players) {
      if (isPiercing) {
        player.applyDamage(damage, true);
        addToSteps([{
          type: EDetailedStep.PlayerTakeDamage,
          playerId: player.ID,
          damage,
          isPiercing: true,
          enemyId: this.ID,
        }]);
      } else {
        const shieldBefore = player.Shields;
        player.applyDamage(damage, false);
        const shieldDelta = player.Shields - shieldBefore;
        if (shieldDelta < 0) {
          addToSteps([{
            type: EDetailedStep.PlayerStatChange,
            stat: "shield",
            playerId: player.ID,
            delta: shieldDelta,
          }]);
        }
        const hpDamage = Math.max(0, damage - shieldBefore);
        if (hpDamage > 0) {
          addToSteps([{
            type: EDetailedStep.PlayerTakeDamage,
            playerId: player.ID,
            damage: hpDamage,
            isPiercing: false,
            enemyId: this.ID,
          }]);
        }
      }
      addToSteps([{
        type: EDetailedStep.EnemyAttack,
        enemyId: this.ID,
        playerId: player.ID,
        damage,
      }]);
    }
  }

  public override getPrimitiveStats(): BossPrimitive {
    return { ...super.getPrimitiveStats(), lives: this.lives };
  }

  public override adminSetStats(stats: {
    hp?: number;
    shield?: number;
    elements?: EElement[];
    effects?: EEnemyEffect[];
    lives?: number;
  }): void {
    super.adminSetStats(stats);
    if (stats.lives !== undefined) this.lives = Math.max(1, stats.lives);
  }

  protected override onBeforeDeath(player: Player): boolean {
    if (this.lives <= 1) return true;
    this.lives--;
    this.hp = this.maxHp;
    this.shield = this.maxShield;
    this.clearElements();
    player.addSteps([{
      type: EDetailedStep.BossReset,
      bossId: this.ID,
      hp: this.maxHp,
      shield: this.maxShield,
      livesRemaining: this.lives,
    }]);
    this.e_onLoseLive.Invoke({ attackingPlayer: player });
    return false;
  }
}
