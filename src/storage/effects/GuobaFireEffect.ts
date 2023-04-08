import { Attack } from "../../../types/general";
import { Player } from "../../game/Player";
import { Pyro } from "../elements/Pyro";
import { PlayerEffect } from "./PlayerEffect";

export class GuobaFireEffect extends PlayerEffect {
  public get Name(): string {
    return "GuobaFire";
  }

  public override onStartCycle(player: Player): boolean {
    for (const enemy of player.Enemies) {
      const attack: Attack = { damage: 2, element: new Pyro(), player };
      enemy.applyAttack(attack);
    }

    return true;
  }
}
