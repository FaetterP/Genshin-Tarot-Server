import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class PyroRegisvine extends Enemy {
  public get Name() {
    return EEnemy.PyroRegisvine;
  }

  constructor() {
    const setup = { hp: 7, mora: 7, damage: 3, shield: 3 };
    super(setup);
  }

  // TODO
}
