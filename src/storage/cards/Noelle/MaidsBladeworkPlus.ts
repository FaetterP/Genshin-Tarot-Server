import { CardUseContext } from "../../../types/functionsContext";
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
          c1.getPrimitive(),
          c2.getPrimitive(),
          c3.getPrimitive(),
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
