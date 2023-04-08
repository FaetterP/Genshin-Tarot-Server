import { getAllPlayers } from "../../../ws";
import { Enemy } from "../Enemy";

export class HilichurlGrenadier extends Enemy {
  public get Name() {
    return "HilichurlGrenadier";
  }

  constructor() {
    const setup = { hp: 7, mora: 5, damage: 2, shield: 0 };
    super(setup);
  }

  override death(): void {
    for(const player of getAllPlayers()){
      // TODO add Burn to top deck
    }
  }
}
