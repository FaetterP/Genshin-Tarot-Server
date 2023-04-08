import { Enemy } from "../Enemy";

export class CryoAbyssMage extends Enemy {
  public get Name() {
    return "CryoAbyssMage";
  }

  constructor() {
    const setup = { hp: 4, mora: 5, damage: 1, shield: 3 };
    super(setup);
  }

  // TODO 
}
