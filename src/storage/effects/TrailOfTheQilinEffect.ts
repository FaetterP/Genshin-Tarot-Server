import { Attack } from "../../types/general";
import { Player } from "../../game/Player";
import { Cryo } from "../elements/Cryo";
import { PlayerEffect } from "./PlayerEffect";

export class TrailOfTheQilinEffect extends PlayerEffect {
  public get Name(): string {
    return "TrailOfTheQilin";
  }

  public override onStartCycle(player: Player): boolean {
    for (const enemy of player.Enemies) {
      const attack: Attack = { damage: 2, element: new Cryo(), player };
      enemy.applyAttack(attack);
    }

    return true;
  }
}
