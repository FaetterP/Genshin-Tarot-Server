import { getAllPlayers } from "../../../ws";
import { Enemy } from "../Enemy";

export class GiantHydroSlime extends Enemy {
  public get Name() {
    return "GiantHydroSlime";
  }

  constructor() {
    const setup = { hp: 5, mora: 3, damage: 2, shield: 0 };
    super(setup);
  }

  override reveal(): void {
    for (const player of getAllPlayers()) {
      // TODO if Freeze in hand
      player.trySpendActonPoints(1);
    }
  }
}
