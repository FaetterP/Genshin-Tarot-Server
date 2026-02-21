import { EDetailedStep, EElement, EPlayerEffect } from "../../types/enums";
import { Attack } from "../../types/general";
import { Player } from "../../game/Player";
import { Cryo } from "../elements/Cryo";
import { PlayerEffect } from "./PlayerEffect";

export class TrailOfTheQilinEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.TrailOfTheQilin;
  }

  public override onStartCycle(player: Player): boolean {
    for (const enemy of player.Enemies) {
      player.addSteps([
        { type: EDetailedStep.EnemyGetElement, enemyId: enemy.ID, element: EElement.Cryo },
      ]);
      player.addSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
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
