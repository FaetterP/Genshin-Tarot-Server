import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class Dash extends Card {
  public get Name(): ECard {
    return ECard.Dash;
  }

  constructor() {
    super(0, ECardType.Other);
  }

  use(ctx: CardUseContext): void {
    ctx.player.trashCardById(this.ID);
    ctx.addToSteps([
      {
        type: EDetailedStep.MoveCard,
        to: "trash",
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
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: ctx.player.ID,
        delta: 1,
      },
    ]);
    ctx.player.addExtraActionPoints(1);
  }
}
