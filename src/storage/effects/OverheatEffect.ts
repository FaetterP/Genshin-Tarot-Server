import { PlayerEffect } from "./PlayerEffect";

export class OverheatEffect extends PlayerEffect {
  public get Name(): string {
    return "Overheat";
  }

  public override getAttackBonus(): { bonusDamage: number; energyOnKill: number } {
    return { bonusDamage: 1, energyOnKill: 2 };
  }
}
