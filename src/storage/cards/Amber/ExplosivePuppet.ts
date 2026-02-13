import { CardUseContext } from "../../../types/functionsContext";
import { ExplosivePuppetEffect } from "../../effects/ExplosivePuppetEffect";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { ExplosivePuppetPlus } from "./ExplosivePuppetPlus";

export class ExplosivePuppet extends Card {
  public get Name(): ECard {
    return ECard.ExplosivePuppet;
  }

  constructor() {
    super(2, ECardType.Skill);
  }

  get Upgrade() {
    return ExplosivePuppetPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    if (ctx.player.Enemies.includes(ctx.enemies[0])) throw new Error("enemy is not in range");

    const effect = new ExplosivePuppetEffect();
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.player.addEffect(effect);

    // TODO: not apply to boss
    ctx.enemies[0].addStun();
  }
}
