import { CardUseContext } from "../../../types/functionsContext";
import { LayeredFrostEffect } from "../../effects/LayeredFrostEffect";
import { Card } from "../Card";
import { LayeredFrostPlus } from "./LayeredFrostPlus";

export class LayeredFrost extends Card {
  public get Name(): string {
    return "LayeredFrost";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return LayeredFrostPlus;
  }

  use(ctx: CardUseContext): void {
    const drawn = ctx.player.drawCard();
    const effect = new LayeredFrostEffect();

    ctx.addToSteps([
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [drawn.getPrimitive()],
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
