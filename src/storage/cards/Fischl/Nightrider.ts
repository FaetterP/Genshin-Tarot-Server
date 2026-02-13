import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { NightriderEffect } from "../../effects/NightriderEffect";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { NightriderPlus } from "./NightriderPlus";

export class Nightrider extends Card {
  public get Name(): ECard {
    return ECard.Nightrider;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return NightriderPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const effect = new NightriderEffect(target);
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 1,
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
      damage: 1,
      isPiercing: true,
      element: new Electro(),
      player: ctx.player,
    });
    target.addEffect(effect);
  }
}
