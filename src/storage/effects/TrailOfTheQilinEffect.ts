import { EElement } from "../../types/enums";
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
      player.addSteps([{ type: "enemy_get_element", enemyId: enemy.ID, element: EElement.Cryo }]);
      player.addSteps([
        {
          type: "enemy_take_damage",
          enemyId: enemy.ID,
          damage: 2,
          isPiercing: false,
          element: EElement.Cryo,
        },
      ]);
      const attack: Attack = { damage: 2, element: new Cryo(), player };
      enemy.applyAttack(attack);
    }

    return true;
  }
}
