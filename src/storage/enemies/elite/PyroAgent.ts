import { Enemy } from "../Enemy";

export class PyroAgent extends Enemy {
  public get Name() {
    return "PyroAgent";
  }

  constructor() {
    const setup = { hp: 5, mora: 7, damage: 3, shield: 0 };
    super(setup);
  }

  // TODO
}
