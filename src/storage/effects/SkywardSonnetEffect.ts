import { EPlayerEffect } from "../../types/enums";
import { Player } from "../../game/Player";
import { PlayerEffect } from "./PlayerEffect";

export class SkywardSonnetEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.SkywardSonnet;
  }

  public override onStartCycle(player: Player): boolean {
    return false;
  }

  public override getAttackBonus(): { bonusDamage: number; energyOnKill: number } | null {
    return { bonusDamage: 1, energyOnKill: 0 };
  }
}
