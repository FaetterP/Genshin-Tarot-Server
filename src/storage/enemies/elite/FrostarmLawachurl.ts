import { Enemy } from "../Enemy";

export class FrostarmLawachurl extends Enemy {
  public get Name() {
    return "FrostarmLawachurl";
  }

  constructor() {
    const setup = { hp: 8, mora: 7, damage: 2, shield: 2 };
    super(setup);
  }

  // TODO
}
