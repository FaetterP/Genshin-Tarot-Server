import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "../Card";

export class RagingTidePlus extends Card {
  public get Name(): string {
    return "RagingTidePlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    const c3 = ctx.player.drawCard();
    ctx.addToSteps([
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [
          c1.getPrimitive(),
          c2.getPrimitive(),
          c3.getPrimitive(),
        ],
      },
    ]);
    // TODO may drop 3 cards and apply Hydro to one enemy per card
  }
}
