import { Enemy } from "../Enemy";

export class AnemoHypostasis extends Enemy {
  public get Name() {
    return "AnemoHypostasis";
  }

  constructor() {
    const setup = { hp: 9, mora: 7, damage: 3, shield: 0 };
    super(setup);
  }

  // TODO
}
