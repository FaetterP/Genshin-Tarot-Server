import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class GaleBladePlus extends Card {
  public get Name(): ECard {
    return ECard.GaleBladePlus;
  }

  constructor() {
    super(0, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element: EElement.Anemo,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.player,
    });
    // TODO
  }
}
