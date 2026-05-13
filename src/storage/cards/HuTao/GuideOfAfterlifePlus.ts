import { CardUseContext } from "../../../types/functionsContext";
import { GuideOfAfterlifeEffect } from "../../effects/GuideOfAfterlifeEffect";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class GuideOfAfterlifePlus extends Card {
  public get Name(): ECard {
    return ECard.GuideOfAfterlifePlus;
  }

  constructor() {
    super(0, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerTakeDamage,
        playerId: ctx.player.ID,
        damage: 1,
        isPiercing: false,
      },
    ]);
    ctx.player.applyDamage(1);

    if (ctx.isUseAlternative) {
      const c1 = ctx.player.drawCard();
      const c2 = ctx.player.drawCard();
      ctx.addToSteps([
        {
          type: EDetailedStep.DrawCards,
          playerId: ctx.player.ID,
          cards: [c1.getPrimitive(), c2.getPrimitive()],
        },
      ]);
    } else {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addEnergy(1);
    }
    const effect = new GuideOfAfterlifeEffect();
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.player.addEffect(effect);
  }
}
