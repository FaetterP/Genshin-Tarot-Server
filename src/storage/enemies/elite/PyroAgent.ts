import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class PyroAgent extends Enemy {
  public get Name() {
    return EEnemy.PyroAgent;
  }

  constructor() {
    const setup = { hp: 5, mora: 7, damage: 3, shield: 0 };
    super(setup);
  }

  // TODO
}
