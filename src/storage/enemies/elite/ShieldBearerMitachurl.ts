import { Enemy } from "../Enemy";

export class ShieldBearerMitachurl extends Enemy {
  public get Name() {
    return "ShieldBearerMitachurl";
  }

  constructor() {
    const setup = { hp: 7, mora: 7, damage: 2, shield: 3 };
    super(setup);
  }
}
