import { Enemy } from "../Enemy";

export class EyeOfStorm extends Enemy {
  public get Name() {
    return "EyeOfStorm";
  }

  constructor() {
    const setup = { hp: 7, mora: 7, damage: 2, shield: 0 };
    super(setup);
  }

  // TODO
}
