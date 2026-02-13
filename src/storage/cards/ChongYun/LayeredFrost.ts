import { CardUseContext } from "../../../types/functionsContext";
import { LayeredFrostEffect } from "../../effects/LayeredFrostEffect";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { LayeredFrostPlus } from "./LayeredFrostPlus";

export class LayeredFrost extends Card {
  public get Name(): ECard {
    return ECard.LayeredFrost;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return LayeredFrostPlus;
  }

  use(ctx: CardUseContext): void {
    const drawn = ctx.player.drawCard();
    const effect = new LayeredFrostEffect();

    ctx.addToSteps([
      {
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [drawn.getPrimitive()],
      },
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);

    ctx.player.addEffect(effect);
  }
}
