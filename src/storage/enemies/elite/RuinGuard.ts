import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class RuinGuard extends Enemy {
  public get Name() {
    return EEnemy.RuinGuard;
  }

  constructor() {
    const setup = { hp: 8, mora: 7, damage: 3, shield: 1 };
    super(setup);
  }
}
