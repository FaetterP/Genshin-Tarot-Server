import { Enemy } from "../Enemy";

export class HilichurlGang extends Enemy {
  public get Name() {
    return "HilichurlGang";
  }

  constructor() {
    const setup = { hp: 7, mora: 3, damage: 2, shield: 0 };
    super(setup);
  }
}
