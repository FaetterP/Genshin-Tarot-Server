import { Enemy } from "../Enemy";

export class CicinCryoMage extends Enemy {
  public get Name() {
    return "CicinCryoMage";
  }

  constructor() {
    const setup = { hp: 5, mora: 7, damage: 2, shield: 2 };
    super(setup);
  }

  // TODO
}
