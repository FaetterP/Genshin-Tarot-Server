import { Attack } from "../../../types/general";
import { Player } from "../../game/Player";
import { Electro } from "../elements/Electro";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class NightriderPlusEffect extends PlayerEffect {
  public get Name(): string {
    return "NightriderPlus";
  }

  private enemy: Enemy;

  constructor(enemy: Enemy) {
    super();
    this.enemy = enemy;
  }

  public onStartCycle(player: Player): boolean {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      isRange: true,
      element: new Electro(),
      player,
    };
    this.enemy.applyAttack(attack);

    return true;
  }
}
