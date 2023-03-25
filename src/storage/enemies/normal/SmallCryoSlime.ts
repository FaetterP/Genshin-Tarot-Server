import { Cryo } from "../../elements/Cryo";
import { Enemy } from "../Enemy";

export class SmallCryoSlime extends Enemy {
  constructor() {
    const setup = { hp: 5, mora: 2, damage: 1, shield: 0 };
    super(setup);
  }

  override reveal(): void {
    this.elements.push(new Cryo());
  }
}
