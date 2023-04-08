import { Enemy } from "../Enemy";

export class PyroWhopperflower extends Enemy {
  public get Name() {
    return "PyroWhopperflower";
  }

  constructor() {
    const setup = { hp: 6, mora: 5, damage: 2, shield: 2 };
    super(setup);
  }

  // TODO
}
