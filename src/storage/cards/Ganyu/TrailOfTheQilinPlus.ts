import { CardUseContext } from "../../../types/functionsContext";
import { TrailOfTheQilinEffect } from "../../effects/TrailOfTheQilinEffect";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class TrailOfTheQilinPlus extends Card {
  public get Name(): ECard {
    return ECard.TrailOfTheQilinPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
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
