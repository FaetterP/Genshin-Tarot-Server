import { EPlayerEffect } from "../../types/enums";
import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class BreastplateEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.Breastplate;
  }

  public onAttack(player: Player, enemy: Enemy): boolean {
    player.addHealth(1);
    return false;
  }
}
