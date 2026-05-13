import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class Freeze extends Card {
  public get Name(): ECard {
    return ECard.Freeze;
  }

  constructor() {
    super(1, ECardType.Other);
  }

  use(ctx: CardUseContext): void {
    const freezeCards = [...ctx.player.Hand].filter((c) => c.Name === ECard.Freeze);
    for (const card of freezeCards) {
      ctx.player.trashCardById(card.ID);
    }
    ctx.addToSteps(
      freezeCards.map((card) => ({
        type: EDetailedStep.MoveCard as const,
        to: "trash",
        playerId: ctx.player.ID,
        card: card.getPrimitive(),
      })),
    );
  }
}
