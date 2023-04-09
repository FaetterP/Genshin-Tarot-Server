import { Player } from "../../game/Player";
import { Hydro } from "../elements/Hydro";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class RaincutterEffect extends PlayerEffect {
  public get Name(): string {
    return "Raincutter";
  }

  public override onAttack(player: Player, enemy: Enemy): boolean {
    enemy.applyElement(new Hydro(), player);
    return false;
  }
}
