import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class HydroAbyssMage extends Enemy {
  public get Name() {
    return EEnemy.HydroAbyssMage;
  }

  constructor() {
    const setup = { hp: 4, mora: 5, damage: 1, shield: 3 };
    super(setup);
  }

  // TODO
}
