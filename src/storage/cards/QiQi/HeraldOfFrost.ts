import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType, EEnemyEffect } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { HeraldOfFrostPlus } from "./HeraldOfFrostPlus";
import { HeraldOfFrostEffect } from "../../effects/HeraldOfFrostEffect";

export class HeraldOfFrost extends Card {
  public get Name(): ECard {
    return ECard.HeraldOfFrost;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return HeraldOfFrostPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const effect = new HeraldOfFrostEffect();
    ctx.addToSteps([
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Cryo },
      { type: EDetailedStep.EnemyGetEffect, enemyId: target.ID, effect: EEnemyEffect.HeraldOfFrost },
    ]);
    target.applyElement(new Cryo(), ctx.player);
    target.addEffect(effect);
  }
}
