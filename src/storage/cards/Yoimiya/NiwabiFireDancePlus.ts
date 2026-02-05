import { CardUseContext } from "../../../../types/functionsContext";
import { NiwabiFireDanceEffect } from "../../effects/NiwabiFireDanceEffect";
import { Card } from "../Card";

export class NiwabiFireDancePlus extends Card {
  public get Name(): string {
    return "NiwabiFireDancePlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    const c3 = ctx.player.drawCard();
    const effect = new NiwabiFireDanceEffect();
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
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.player.addEffect(effect);
  }
}
