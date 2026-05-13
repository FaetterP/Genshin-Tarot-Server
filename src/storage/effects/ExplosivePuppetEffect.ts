import { EDetailedStep, EElement, EPlayerEffect } from "../../types/enums";
import { Attack } from "../../types/general";
import { Player } from "../../game/Player";
import { Pyro } from "../elements/Pyro";
import { PlayerEffect } from "./PlayerEffect";

export class ExplosivePuppetEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.ExplosivePuppet;
  }

  public override onStartCycle(player: Player): boolean {
    for (const enemy of player.Enemies) {
      player.addSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: enemy.ID,
          damage: 2,
          isPiercing: false,
          element: EElement.Pyro,
        },
      ]);

      const attack: Attack = {
        damage: 2,
        element: new Pyro(),
        player: player,
      };

      enemy.applyAttack(attack);
    }

    return true;
  }
}
