import { Enemy } from "../Enemy";

export class PyroSlinger extends Enemy {
  public get Name() {
    return "PyroSlinger";
  }

  constructor() {
    const setup = { hp: 5, mora: 6, damage: 2, shield: 2 };
    super(setup);
  }

  // TODO
}
