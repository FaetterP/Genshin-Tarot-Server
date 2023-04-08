import { Enemy } from "../Enemy";

export class StonehideLawachurl extends Enemy {
  public get Name() {
    return "StonehideLawachurl";
  }

  constructor() {
    const setup = { hp: 8, mora: 7, damage: 2, shield: 2 };
    super(setup);
  }

  // TODO
}
