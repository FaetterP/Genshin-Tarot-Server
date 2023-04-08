import { Geo } from "../../elements/Geo";
import { Enemy } from "../Enemy";

export class SmallGeoSlime extends Enemy {
  public get Name() {
    return "SmallGeoSlime";
  }

  constructor() {
    const setup = { hp: 5, mora: 2, damage: 1, shield: 0 };
    super(setup);
  }

  override reveal(): void {
    this.elements.push(new Geo());
  }
}
