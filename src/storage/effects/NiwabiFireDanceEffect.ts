import { Player } from "../../game/Player";
import { Pyro } from "../elements/Pyro";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class NiwabiFireDanceEffect extends PlayerEffect {
  public get Name(): string {
    return "NiwabiFireDance";
  }

  public override onAttack(player: Player, enemy: Enemy): boolean {
    enemy.applyElement(new Pyro(), player);
    return true;
  }
}
