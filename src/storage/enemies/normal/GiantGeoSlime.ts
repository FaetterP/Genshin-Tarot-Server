import { Enemy } from "../Enemy";

export class GiantGeoSlime extends Enemy {
  public get Name() {
    return "GiantGeoSlime";
  }

  constructor() {
    const setup = { hp: 5, mora: 3, damage: 2, shield: 1 };
    super(setup);
  }
}
