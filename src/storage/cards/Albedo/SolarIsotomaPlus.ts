import { CardUseContext } from "../../../types/functionsContext";
import { SolarIsotomaEffect } from "../../effects/SolarIsotomaEffect";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class SolarIsotomaPlus extends Card {
  public get Name(): string {
    return "SolarIsotomaPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (ctx.selectedCard === this.ID)
      throw new Error("card cannot trash itself");

    if (ctx.selectedCard) {
      const inHand = ctx.player.Hand.some((c) => c.ID === ctx.selectedCard);
      const inDiscard = ctx.player.Discard.some((c) => c.ID === ctx.selectedCard);
      if (!inHand && !inDiscard) {
        throw new Error("selectedCard must be a card in your hand or discard");
      }
    }

    const effect = new SolarIsotomaEffect();
    ctx.addToSteps([
      ...ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Geo",
      })),
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }
    ctx.player.addEffect(effect);

    if (ctx.selectedCard) {
      ctx.player.trashCardById(ctx.selectedCard)
      const drawn = ctx.player.drawCard();
      ctx.addToSteps([
        { type: "draw_cards", playerId: ctx.player.ID, cards: [drawn.getPrimitive()] },
      ]);
    }
  }
}
