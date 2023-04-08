import { getAllPlayers } from "../../../ws";
import { Enemy } from "../Enemy";

export class AnemoShamachurl extends Enemy {
  public get Name() {
    return "AnemoShamachurl";
  }

  constructor() {
    const setup = { hp: 5, mora: 4, damage: 2, shield: 0 };
    super(setup);
  }

  override death(): void {
    for (const player of getAllPlayers()) {
      player.trySpendEnergy(1);
      player.trySpendEnergy(1);
      player.trySpendEnergy(1);
    }
  }
}
