import { CardUseContext } from "../../../types/functionsContext";
import { NiwabiFireDanceEffect } from "../../effects/NiwabiFireDanceEffect";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { NiwabiFireDancePlus } from "./NiwabiFireDancePlus";

export class NiwabiFireDance extends Card {
  public get Name(): ECard {
    return ECard.NiwabiFireDance;
  }

  constructor() {
    super(0, ECardType.Skill);
  }

  get Upgrade() {
    return NiwabiFireDancePlus;
  }

  use(ctx: CardUseContext): void {
    const effect = new NiwabiFireDanceEffect();
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
