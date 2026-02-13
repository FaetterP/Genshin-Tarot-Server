import { EPlayerEffect } from "../../types/enums";
import { Attack } from "../../types/general";
import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class StormbreakerEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.Stormbreaker;
  }

  public override onAttack(player: Player, enemy: Enemy): boolean {
    const attack: Attack = {
      damage: 1,
      isRange: true,
      isPiercing: true,
      player,
    };
    enemy.applyAttack(attack);
    return false;
  }
}
