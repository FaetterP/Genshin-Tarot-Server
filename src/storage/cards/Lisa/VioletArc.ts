import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { VioletArc as VioletArcPlus } from "./VioletArcPlus";

export class VioletArc extends Card {
  public get Name(): ECard {
    return ECard.VioletArc;
  }

  constructor() {
    super(2, ECardType.Skill);
  }

  get Upgrade() {
    return VioletArcPlus;
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
