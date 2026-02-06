import { Electro } from "../elements/Electro";
import { Enemy } from "../enemies/Enemy";
import { EnemyEffect } from "./EnemyEffect";
import type { EnemyStartCycleContext } from "../../types/eventsContext";

export class NightriderEffect extends EnemyEffect {
  public get Name(): string {
    return "Nightrider";
  }

  private enemy: Enemy;

  constructor(enemy: Enemy) {
    super();
    this.enemy = enemy;
  }

  public onStartCycle(ctx: EnemyStartCycleContext): boolean {
    this.enemy.applyAttack({
      damage: 1,
      isPiercing: true,
      element: new Electro(),
      player: ctx.player,
    });
    return true;
  }
}
