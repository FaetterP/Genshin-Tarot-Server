import { getAllPlayers } from "../../../ws";
import { EEnemy } from "../../../types/enums";
import { Enemy } from "../Enemy";

export class GiantPyroSlime extends Enemy {
  public get Name() {
    return EEnemy.GiantPyroSlime;
  }

  constructor() {
    const setup = { hp: 5, mora: 3, damage: 2, shield: 0 };
    super(setup);
  }

  override reveal(): void {
    for (const player of getAllPlayers()) {
      // TODO add Burn to discard
    }
  }
}
