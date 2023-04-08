import { Enemy } from "../Enemy";

export class CryoHilichurlShooter extends Enemy {
  public get Name() {
    return "CryoHilichurlShooter";
  }

  constructor() {
    const setup = { hp: 7, mora: 3, damage: 1, shield: 0 };
    super(setup);
  }

  // TODO 
}
