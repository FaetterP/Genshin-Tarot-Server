import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class ElectroCicinSwarm extends Enemy {
  public get Name() {
    return EEnemy.ElectroCicinSwarm;
  }

  constructor() {
    const setup = { hp: 3, mora: 3, damage: 1, shield: 0 };
    super(setup);
  }

  // TODO
}
