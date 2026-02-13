import type { EEnemyEffect } from "../../types/enums";
import type { EnemyStartCycleContext } from "../../types/eventsContext";

export abstract class EnemyEffect {
  public abstract get Name(): EEnemyEffect;

  public onStartCycle(ctx: EnemyStartCycleContext): boolean {
    return true;
  }
}
