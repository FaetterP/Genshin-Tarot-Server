import type { EEnemyEffect } from "../../types/enums";
import type { EnemyStartCycleContext, EnemyTakeDamageContext } from "../../types/eventsContext";

export abstract class EnemyEffect {
  public abstract get Name(): EEnemyEffect;

  public onStartCycle(ctx: EnemyStartCycleContext): boolean {
    return true;
  }

  public onTakeDamage(ctx: EnemyTakeDamageContext): boolean {
    return false;
  }
}
