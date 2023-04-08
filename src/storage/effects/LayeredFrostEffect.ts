import { Player } from "../../game/Player";
import { Cryo } from "../elements/Cryo";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class LayeredFrostEffect extends PlayerEffect {
  public get Name(): string {
    return "LayeredFrost";
  }

  public override onAttack(player: Player, enemy: Enemy): boolean {
    enemy.applyElement(new Cryo(), player);

    return false;
  }
}
