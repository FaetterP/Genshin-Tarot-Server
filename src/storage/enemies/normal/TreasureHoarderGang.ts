import { Enemy } from "../Enemy";

export class TreasureHoarderGang extends Enemy {
  public get Name() {
    return "TreasureHoarderGang";
  }

  constructor() {
    const setup = { hp: 7, mora: 4, damage: 2, shield: 0 };
    super(setup);
  }

  // TODO
}
