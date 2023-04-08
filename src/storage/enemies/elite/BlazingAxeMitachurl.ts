import { Enemy } from "../Enemy";

export class BlazingAxeMitachurl extends Enemy {
  public get Name() {
    return "BlazingAxeMitachurl";
  }

  constructor() {
    const setup = { hp: 7, mora: 7, damage: 3, shield: 0 };
    super(setup);
  }

  // TODO
}
