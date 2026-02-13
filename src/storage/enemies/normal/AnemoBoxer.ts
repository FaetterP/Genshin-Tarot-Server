import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class AnemoBoxer extends Enemy {
  public get Name() {
    return EEnemy.AnemoBoxer;
  }

  constructor() {
    const setup = { hp: 7, mora: 6, damage: 3, shield: 1 };
    super(setup);
  }

  // TODO
}
