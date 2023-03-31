import { Electro } from "../../elements/Electro";
import { Enemy } from "../Enemy";

export class SmallElectroSlime extends Enemy {
  public get Name() {
    return "SmallElectroSlime";
  }

  constructor() {
    const setup = { hp: 5, mora: 2, damage: 1, shield: 0 };
    super(setup);
  }

  override reveal(): void {
    this.elements.push(new Electro());
  }
}
