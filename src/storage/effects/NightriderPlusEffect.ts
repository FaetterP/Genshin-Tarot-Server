import { EEnemyEffect, EDetailedStep, EElement } from "../../types/enums";
import { Electro } from "../elements/Electro";
import { Enemy } from "../enemies/Enemy";
import { EnemyEffect } from "./EnemyEffect";
import type { EnemyStartCycleContext } from "../../types/eventsContext";

export class NightriderPlusEffect extends EnemyEffect {
  public get Name(): EEnemyEffect {
    return EEnemyEffect.NightriderPlus;
  }

  private enemy: Enemy;

  constructor(enemy: Enemy) {
    super();
    this.enemy = enemy;
  }

  public onStartCycle(ctx: EnemyStartCycleContext): boolean {
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: this.enemy.ID,
        damage: 2,
        isPiercing: true,
        element: EElement.Electro,
      },
    ]);
    this.enemy.applyAttack({
      damage: 2,
      isPiercing: true,
      isRange: true,
      element: new Electro(),
      player: ctx.player,
    });
    this.enemy.markHitByNightriderEffect();
    return true;
  }
}
