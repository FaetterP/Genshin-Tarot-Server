import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class ChihayaburuPlus extends Card {
  public get Name(): ECard {
    return ECard.ChihayaburuPlus;
  }

  constructor() {
    super(0, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    ctx.addToSteps([
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Anemo,
        }),
      ),
      {
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [c1.getPrimitive(), c2.getPrimitive()],
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }
  }
}
