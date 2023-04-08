import { Enemy } from "../Enemy";

export class ElectroHypostasis extends Enemy {
  public get Name() {
    return "ElectroHypostasis";
  }

  constructor() {
    const setup = { hp: 9, mora: 7, damage: 3, shield: 0 };
    super(setup);
  }

  // TODO
}
