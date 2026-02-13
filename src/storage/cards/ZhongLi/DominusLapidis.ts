import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { DominusLapidisEffect } from "../../effects/DominusLapidisEffect";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";
import { DominusLapidis as DominusLapidisPlus } from "./DominusLapidisPlus";

export class DominusLapidis extends Card {
  public get Name(): ECard {
    return ECard.DominusLapidis;
  }

  constructor() {
    super(2, ECardType.Skill);
  }

  get Upgrade() {
    return DominusLapidisPlus;
  }

  use(ctx: CardUseContext): void {
    const effect = new DominusLapidisEffect();
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerChangeShield,
        playerId: ctx.player.ID,
        delta: 3,
      },
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Geo,
        }),
      ),
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    if (ctx.selectedPlayer) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerChangeShield,
          playerId: ctx.selectedPlayer.ID,
          delta: 3,
        },
      ]);
    }
    ctx.player.addShield(3);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addShield(3);
    }

    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }

    ctx.player.addEffect(effect);
  }
}
