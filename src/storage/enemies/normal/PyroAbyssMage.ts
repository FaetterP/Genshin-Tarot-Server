import { Enemy } from "../Enemy";

export class PyroAbyssMage extends Enemy {
  public get Name() {
    return "PyroAbyssMage";
  }

  constructor() {
    const setup = { hp: 4, mora: 5, damage: 1, shield: 3 };
    super(setup);
  }

  // TODO 
}
