import { Enemy } from "../Enemy";

export class RuinHunter extends Enemy {
  public get Name() {
    return "RuinHunter";
  }

  constructor() {
    const setup = { hp: 9, mora: 7, damage: 4, shield: 0 };
    super(setup);
  }
}
