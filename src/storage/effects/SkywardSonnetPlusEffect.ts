import { EPlayerEffect } from "../../types/enums";
import { Attack } from "../../types/general";
import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class SkywardSonnetPlusEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.SkywardSonnetPlus;
  }

  public override onStartCycle(player: Player): boolean {
    return false;
  }

  // TODO
  public override onAttack(player: Player, enemy: Enemy): boolean {
    const attack: Attack = { damage: 2, player: player };
    enemy.applyAttack(attack);

    return true;
  }
}
