import type { EnemyStartCycleContext } from "../../types/eventsContext";

export abstract class EnemyEffect {
  public abstract get Name(): string;

  public onStartCycle(ctx: EnemyStartCycleContext): boolean {
    return true;
  }
}
