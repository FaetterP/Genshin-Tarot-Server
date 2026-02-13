import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class VioletArc extends Card {
  public get Name(): ECard {
    return ECard.VioletArcPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      if (enemy.isContainsElement(EElement.Electro)) {
        ctx.addToSteps([
          {
            type: EDetailedStep.EnemyTakeDamage,
            enemyId: enemy.ID,
            damage: 5,
            isPiercing: true,
            element: EElement.Electro,
          },
        ]);
      }
    }

    for (const enemy of ctx.player.Enemies) {
      if (enemy.isContainsElement(EElement.Electro)) {
        enemy.applyAttack({
          damage: 5,
          isPiercing: true,
          element: new Electro(),
          player: ctx.player,
        });
      }
    }
  }
}
