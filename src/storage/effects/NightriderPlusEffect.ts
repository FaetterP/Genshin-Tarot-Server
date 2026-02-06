import { Electro } from "../elements/Electro";
import { Enemy } from "../enemies/Enemy";
import { EnemyEffect } from "./EnemyEffect";
import type { EnemyStartCycleContext } from "../../types/eventsContext";

export class NightriderPlusEffect extends EnemyEffect {
  public get Name(): string {
    return "NightriderPlus";
  }

  private enemy: Enemy;

  constructor(enemy: Enemy) {
    super();
    this.enemy = enemy;
  }

  public onStartCycle(ctx: EnemyStartCycleContext): boolean {
    this.enemy.applyAttack({
      damage: 2,
      isPiercing: true,
      isRange: true,
      element: new Electro(),
      player: ctx.player,
    });
    return true;
  }
}
