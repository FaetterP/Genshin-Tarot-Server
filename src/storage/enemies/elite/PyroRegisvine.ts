import { Enemy } from "../Enemy";

export class PyroRegisvine extends Enemy {
  public get Name() {
    return "PyroRegisvine";
  }

  constructor() {
    const setup = { hp: 7, mora: 7, damage: 3, shield: 3 };
    super(setup);
  }

  // TODO
}
