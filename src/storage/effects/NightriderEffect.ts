import { Attack } from "../../../types/general";
import { Player } from "../../game/Player";
import { Electro } from "../elements/Electro";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class NightriderEffect extends PlayerEffect {
  public get Name(): string {
    return "Nightrider";
  }

  private enemy: Enemy;

  constructor(enemy: Enemy) {
    super();
    this.enemy = enemy;
  }

  public onStartCycle(player: Player): boolean {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      element: new Electro(),
      player,
    };
    this.enemy.applyAttack(attack);

    return true;
  }
}
