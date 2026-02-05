import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class MaidsBladeworkPlus extends Card {
  public get Name(): string {
    return "MaidsBladeworkPlus";
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
          { cardId: c1.ID, name: c1.Name },
          { cardId: c2.ID, name: c2.Name },
          { cardId: c3.ID, name: c3.Name },
        ],
      },
      {
        type: "player_change_shield",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    ctx.player.addShield(2);
  }
}
