import { Enemy } from "../Enemy";

export class HydroGunner extends Enemy {
  public get Name() {
    return "HydroGunner";
  }

  constructor() {
    const setup = { hp: 7, mora: 6, damage: 2, shield: 2 };
    super(setup);
  }

  // TODO
}
