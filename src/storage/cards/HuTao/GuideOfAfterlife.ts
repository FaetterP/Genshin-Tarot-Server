import { CardUseContext } from "../../../types/functionsContext";
import { GuideOfAfterlifeEffect } from "../../effects/GuideOfAfterlifeEffect";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { GuideOfAfterlifePlus } from "./GuideOfAfterlifePlus";

export class GuideOfAfterlife extends Card {
  public get Name(): ECard {
    return ECard.GuideOfAfterlife;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return GuideOfAfterlifePlus;
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
          type: EDetailedStep.PlayerChangeEnergy,
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
