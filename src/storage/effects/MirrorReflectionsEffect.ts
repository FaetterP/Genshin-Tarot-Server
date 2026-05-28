import { EDetailedStep, EElement, EPlayerEffect } from "../../types/enums";
import { Attack } from "../../types/general";
import { Player } from "../../game/Player";
import { Hydro } from "../elements/Hydro";
import { PlayerEffect } from "./PlayerEffect";

export class MirrorReflectionsEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.MirrorReflections;
  }

  public override onStartCycle(player: Player): boolean {
    for (const enemy of player.Enemies) {
      player.addSteps([
        { type: EDetailedStep.EnemyGetElement, enemyId: enemy.ID, element: EElement.Hydro },
      ]);
      player.addSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: enemy.ID,
          damage: 2,
          isPiercing: false,
          element: EElement.Hydro,
        },
      ]);

      const attack: Attack = {
        damage: 2,
        player,
      };
      enemy.applyAttack(attack);
      enemy.applyElement(new Hydro(), player);
    }

    return true;
  }
}
