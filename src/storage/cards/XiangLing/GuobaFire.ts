import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { GuobaFireEffect } from "../../effects/GuobaFireEffect";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { GuobaFirePlus } from "./GuobaFirePlus";

export class GuobaFire extends Card {
  public get Name(): ECard {
    return ECard.GuobaFire;
  }

  constructor() {
    super(2, ECardType.Skill);
  }

  get Upgrade() {
    return GuobaFirePlus;
  }

  use(ctx: CardUseContext): void {
    const effect = new GuobaFireEffect();
    ctx.addToSteps([
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: enemy.ID,
          damage: 2,
          isPiercing: false,
          element: EElement.Pyro,
        }),
      ),
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyAttack({
        damage: 2,
        element: new Pyro(),
        player: ctx.player,
      });
    }
    ctx.player.addEffect(effect);
  }
}
