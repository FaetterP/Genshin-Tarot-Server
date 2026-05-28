import { ElementReactionContext } from "../../types/functionsContext";
import { BaseElement } from "./BaseElement";
import { EDetailedStep, EElement } from "../../types/enums";

export class Electro extends BaseElement {
  public get Name() {
    return EElement.Electro;
  }

  reaction(ctx: ElementReactionContext) {
    const damage = 2;
    ctx.player.addSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: ctx.enemy.ID,
        damage,
        isPiercing: true,
      },
    ]);
    ctx.enemy.applyAttack({ damage, isPiercing: true, player: ctx.player });
    ctx.player.addEnergy(1);
  }
}
