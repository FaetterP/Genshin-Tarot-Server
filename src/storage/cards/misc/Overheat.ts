import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class Overheat extends Card {
  public get Name(): string {
    return "Overheat";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    ctx.addToSteps([
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [
          { cardId: c1.ID, name: c1.Name },
          { cardId: c2.ID, name: c2.Name },
        ],
      },
    ]);
    // TODO
  }
}
