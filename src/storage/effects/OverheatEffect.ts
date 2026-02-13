import { EPlayerEffect } from "../../types/enums";
import { PlayerEffect } from "./PlayerEffect";

export class OverheatEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.Overheat;
  }

  public override getAttackBonus(): { bonusDamage: number; energyOnKill: number } {
    return { bonusDamage: 1, energyOnKill: 2 };
  }
}
