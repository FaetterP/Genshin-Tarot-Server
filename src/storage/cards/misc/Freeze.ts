import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class Freeze extends Card {
  public get Name(): string {
    return "Freeze";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const freezeCards = [...ctx.player.Hand].filter((c) => c.Name === "Freeze");
    for (const card of freezeCards) {
      ctx.player.removeCardFromHand(card);
    }
    ctx.addToSteps(
      freezeCards.map((card) => ({
        type: "trash_card" as const,
        playerId: ctx.player.ID,
        card: { cardId: card.ID, name: card.Name },
      }))
    );
  }
}
