import { getAllPlayers } from "../../../ws";
import { Enemy } from "../Enemy";

export class GeoShamachurl extends Enemy {
  public get Name() {
    return "GeoShamachurl";
  }

  constructor() {
    const setup = { hp: 5, mora: 4, damage: 2, shield: 0 };
    super(setup);
  }

  override death(): void {
    for (const player of getAllPlayers()) {
      player.addShield(-4);
    }
  }
}
