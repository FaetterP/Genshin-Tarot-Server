import { EPlayerEffect } from "../../types/enums";
import { Player } from "../../game/Player";
import { PlayerEffect } from "./PlayerEffect";

export class SkywardSonnetPlusEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.SkywardSonnetPlus;
  }

  public override onStartCycle(_player: Player): boolean {
    return false;
  }

  public override getAttackBonus(): { bonusDamage: number; energyOnKill: number } | null {
    return { bonusDamage: 2, energyOnKill: 0 };
  }
}
