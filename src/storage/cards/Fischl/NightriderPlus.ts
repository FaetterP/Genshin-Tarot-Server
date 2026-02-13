import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { NightriderPlusEffect } from "../../effects/NightriderPlusEffect";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class NightriderPlus extends Card {
  public get Name(): ECard {
    return ECard.NightriderPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const effect = new NightriderPlusEffect(target);
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 2,
        isPiercing: true,
        element: EElement.Electro,
      },
      {
        type: EDetailedStep.EnemyGetEffect,
        enemyId: target.ID,
        effect: effect.Name,
      },
    ]);
    target.applyAttack({
      damage: 2,
      isPiercing: true,
      isRange: true,
      element: new Electro(),
      player: ctx.player,
    });
    target.addEffect(effect);
  }
}
