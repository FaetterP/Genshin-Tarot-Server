import { Pyro } from "../../elements/Pyro";
import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class SmallPyroSlime extends Enemy {
  public get Name() {
    return EEnemy.SmallPyroSlime;
  }

  constructor() {
    const setup = { hp: 5, mora: 2, damage: 1, shield: 0 };
    super(setup);
  }

  override reveal(): void {
    this.elements.push(new Pyro());
  }
}
