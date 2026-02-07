import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "../Card";

export class Dash extends Card {
  public get Name(): string {
    return "Dash";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.trashCardById(this.ID);
    ctx.addToSteps([
      {
        type: "trash_card",
        playerId: ctx.player.ID,
        card: this.getPrimitive(),
      },
    ]);

    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    ctx.addToSteps([
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [
          c1.getPrimitive(),
          c2.getPrimitive(),
        ],
      },
      {
        type: "player_change_action_points",
        playerId: ctx.player.ID,
        delta: 1,
      },
    ]);
    ctx.player.addExtraActionPoints(1);
  }
}
