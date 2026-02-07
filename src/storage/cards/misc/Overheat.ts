import { CardUseContext } from "../../../types/functionsContext";
import { OverheatEffect } from "../../effects/OverheatEffect";
import { Card } from "../Card";

export class Overheat extends Card {
  public get Name(): string {
    return "Overheat";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.addEffect(new OverheatEffect());

    ctx.player.trashCardById(this.ID);
    ctx.addToSteps([
      {
        type: "trash_card",
        playerId: ctx.player.ID,
        card: { cardId: this.ID, name: this.Name },
      },
    ]);

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
  }
}
