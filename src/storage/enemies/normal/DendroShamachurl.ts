import { getAllPlayers } from "../../../ws";
import { Enemy } from "../Enemy";

export class DendroShamachurl extends Enemy {
  public get Name() {
    return "DendroShamachurl";
  }

  constructor() {
    const setup = { hp: 5, mora: 4, damage: 2, shield: 0 };
    super(setup);
  }

  override death(): void {
    for (const player of getAllPlayers()) {
      player.applyDamage(3);
    }
  }
}
