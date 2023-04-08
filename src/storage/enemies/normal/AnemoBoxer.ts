import { Enemy } from "../Enemy";

export class AnemoBoxer extends Enemy {
  public get Name() {
    return "AnemoBoxer";
  }

  constructor() {
    const setup = { hp: 7, mora: 6, damage: 3, shield: 1 };
    super(setup);
  }

  // TODO
}
