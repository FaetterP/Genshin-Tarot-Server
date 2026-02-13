import { CardUseContext } from "../../../types/functionsContext";
import { NiwabiFireDanceEffect } from "../../effects/NiwabiFireDanceEffect";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class NiwabiFireDancePlus extends Card {
  public get Name(): ECard {
    return ECard.NiwabiFireDancePlus;
  }

  constructor() {
    super(0, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    const c3 = ctx.player.drawCard();
    const effect = new NiwabiFireDanceEffect();
    ctx.addToSteps([
      {
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [c1.getPrimitive(), c2.getPrimitive(), c3.getPrimitive()],
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
