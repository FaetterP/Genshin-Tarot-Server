import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "../Card";
import { RagingTidePlus } from "./RagingTidePlus";

export class RagingTide extends Card {
  public get Name(): string {
    return "RagingTide";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return RagingTidePlus;
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
          { cardId: c1.ID, name: c1.Name },
          { cardId: c2.ID, name: c2.Name },
          { cardId: c3.ID, name: c3.Name },
        ],
      },
    ]);
    // TODO may drop 3 cards and apply Hydro to one enemy per card
  }
}
