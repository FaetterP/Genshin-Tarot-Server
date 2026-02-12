import { CardUseContext } from "../../../types/functionsContext";
import { LayeredFrostEffect } from "../../effects/LayeredFrostEffect";
import { ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class LayeredFrostPlus extends Card {
  public get Name(): string {
    return "LayeredFrostPlus";
  }

  constructor() {
    super(0, ECardType.Skill);
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
