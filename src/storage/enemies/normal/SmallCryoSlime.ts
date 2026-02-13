import { Cryo } from "../../elements/Cryo";
import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class SmallCryoSlime extends Enemy {
  public get Name() {
    return EEnemy.SmallCryoSlime;
  }

  constructor() {
    const setup = { hp: 5, mora: 2, damage: 1, shield: 0 };
    super(setup);
  }

  override reveal(): void {
    this.elements.push(new Cryo());
  }
}
