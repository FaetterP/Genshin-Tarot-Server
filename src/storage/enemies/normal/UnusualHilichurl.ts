import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class UnusualHilichurl extends Enemy {
  public get Name() {
    return EEnemy.UnusualHilichurl;
  }

  constructor() {
    const setup = { hp: 7, mora: 0, damage: 2, shield: 0 };
    super(setup);
  }

  death(): void {
    // TODO
  }
}
