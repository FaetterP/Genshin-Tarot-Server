import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType, EEnemyEffect } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { HeraldOfFrostPlusEffect } from "../../effects/HeraldOfFrostPlusEffect";

export class HeraldOfFrostPlus extends Card {
  public get Name(): ECard {
    return ECard.HeraldOfFrostPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const effect = new HeraldOfFrostPlusEffect();
    ctx.addToSteps([
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Cryo },
      { type: EDetailedStep.EnemyGetEffect, enemyId: target.ID, effect: EEnemyEffect.HeraldOfFrostPlus },
    ]);
    target.applyElement(new Cryo(), ctx.player);
    target.addEffect(effect);
  }
}
