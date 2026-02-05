import { CardUseContext } from "../../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class ChihayaburuPlus extends Card {
  public get Name(): string {
    return "ChihayaburuPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    ctx.addToSteps([
      ...ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Anemo",
      })),
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [
          { cardId: c1.ID, name: c1.Name },
          { cardId: c2.ID, name: c2.Name },
        ],
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }
  }
}
