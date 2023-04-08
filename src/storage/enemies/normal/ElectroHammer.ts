import { Enemy } from "../Enemy";

export class ElectroHammer extends Enemy {
  public get Name() {
    return "ElectroHammer";
  }

  constructor() {
    const setup = { hp: 7, mora: 6, damage: 3, shield: 1 };
    super(setup);
  }
}
