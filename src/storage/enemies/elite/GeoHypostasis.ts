import { Enemy } from "../Enemy";

export class GeoHypostasis extends Enemy {
  public get Name() {
    return "GeoHypostasis";
  }

  constructor() {
    const setup = { hp: 9, mora: 7, damage: 3, shield: 0 };
    super(setup);
  }

  // TODO
}
