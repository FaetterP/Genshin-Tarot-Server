import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { SkywardSonnetPlusEffect } from "../../effects/SkywardSonnetPlusEffect";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class SkywardSonnetPlus extends Card {
  public get Name(): ECard {
    return ECard.SkywardSonnetPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    const player = ctx.selectedPlayer ?? ctx.player;
    const effect = new SkywardSonnetPlusEffect();
    ctx.addToSteps([
      ...player.Enemies.map(
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
    for (const enemy of player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }
    ctx.player.addEffect(effect);
  }
}
