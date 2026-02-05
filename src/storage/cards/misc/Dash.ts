import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class Dash extends Card {
  public get Name(): string {
    return "Dash";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.removeCardFromHand(this);
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
      {
        type: "player_change_action_points",
        playerId: ctx.player.ID,
        delta: 1,
      },
    ]);
    ctx.player.addExtraActionPoints(1);
  }
}
