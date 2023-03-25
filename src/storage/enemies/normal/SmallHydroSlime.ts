import { Hydro } from "../../elements/Hydro";
import { Enemy } from "../Enemy";

export class SmallHydroSlime extends Enemy {
  constructor() {
    const setup = { hp: 5, mora: 2, damage: 1, shield: 0 };
    super(setup);
  }

  override reveal(): void {
    this.elements.push(new Hydro());
  }
}
