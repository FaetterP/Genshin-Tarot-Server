import { Anemo } from "../../elements/Anemo";
import { Enemy } from "../Enemy";

export class SmallAnemoSlime extends Enemy {
  public get Name() {
    return "SmallAnemoSlime";
  }

  constructor() {
    const setup = { hp: 5, mora: 2, damage: 1, shield: 0 };
    super(setup);
  }

  override reveal(): void {
    this.elements.push(new Anemo());
  }
}
