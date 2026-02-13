import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class HilichurlGuard extends Enemy {
  public get Name() {
    return EEnemy.HilichurlGuard;
  }

  constructor() {
    const setup = { hp: 7, mora: 4, damage: 2, shield: 1 };
    super(setup);
  }
}
