import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class CryoWhopperflower extends Enemy {
  public get Name() {
    return EEnemy.CryoWhopperflower;
  }

  constructor() {
    const setup = { hp: 6, mora: 5, damage: 2, shield: 2 };
    super(setup);
  }

  // TODO
}
