import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { OverheatEffect } from "../../effects/OverheatEffect";
import { Card } from "../Card";

export class Overheat extends Card {
  public get Name(): ECard {
    return ECard.Overheat;
  }

  constructor() {
    super(0, ECardType.Other);
  }

  use(ctx: CardUseContext): void {
    ctx.player.addEffect(new OverheatEffect());

    ctx.player.trashCardById(this.ID);
    ctx.addToSteps([
      {
        type: EDetailedStep.TrashCard,
        playerId: ctx.player.ID,
        card: this.getPrimitive(),
      },
    ]);

    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    ctx.addToSteps([
      {
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [c1.getPrimitive(), c2.getPrimitive()],
      },
    ]);
  }
}
