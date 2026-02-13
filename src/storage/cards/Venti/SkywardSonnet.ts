import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { SkywardSonnetEffect } from "../../effects/SkywardSonnetEffect";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { SkywardSonnetPlus } from "./SkywardSonnetPlus";

export class SkywardSonnet extends Card {
  public get Name(): ECard {
    return ECard.SkywardSonnet;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return SkywardSonnetPlus;
  }

  use(ctx: CardUseContext): void {
    const effect = new SkywardSonnetEffect();
    ctx.addToSteps([
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Anemo,
        }),
      ),
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }
    ctx.player.addEffect(effect);
  }
}
