import { Enemy } from "../Enemy";

export class CryoGunner extends Enemy {
  public get Name() {
    return "CryoGunner";
  }

  constructor() {
    const setup = { hp: 7, mora: 6, damage: 2, shield: 2 };
    super(setup);
  }

  // TODO
}
