import { Enemy } from "../Enemy";

export class HilichurlBerserk extends Enemy {
  public get Name() {
    return "HilichurlBerserk";
  }

  constructor() {
    const setup = { hp: 7, mora: 4, damage: 3, shield: 0 };
    super(setup);
  }

  // TODO
}
