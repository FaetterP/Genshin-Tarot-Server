import { CardUseContext } from "../../../types/functionsContext";
import { TrailOfTheQilinEffect } from "../../effects/TrailOfTheQilinEffect";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { TrailOfTheQilinPlus } from "./TrailOfTheQilinPlus";

export class TrailOfTheQilin extends Card {
  public get Name(): ECard {
    return ECard.TrailOfTheQilin;
  }

  constructor() {
    super(2, ECardType.Skill);
  }

  get Upgrade() {
    return TrailOfTheQilinPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    if (!ctx.player.Enemies.includes(ctx.enemies[0])) {
      throw new Error("enemy is not in range");
    }

    const effect = new TrailOfTheQilinEffect();
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.enemies[0].addStun();
    ctx.player.addEffect(effect);
  }
}
