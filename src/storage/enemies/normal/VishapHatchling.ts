import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class VishapHatchling extends Enemy {
  public get Name() {
    return EEnemy.VishapHatchling;
  }

  constructor() {
    const setup = { hp: 5, mora: 4, damage: 3, shield: 2 };
    super(setup);
  }

  // TODO
}
