import { Enemy } from "../Enemy";

export class RuinGrader extends Enemy {
  public get Name() {
    return "RuinGrader";
  }

  constructor() {
    const setup = { hp: 4, mora: 7, damage: 3, shield: 4 };
    super(setup);
  }

  // TODO
}
