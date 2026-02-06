import { CharacterUseBurstContext } from "../../types/functionsContext";
import { ForeignIronwind } from "../cards/Lumine/ForeignIronwind";
import { PalmVortex } from "../cards/Lumine/PalmVortex";
import { Character } from "./Character";

export class Lumine extends Character {
  public get Name() {
    return "Lumine";
  }

  constructor() {
    const cards = [
      new ForeignIronwind(),
      new ForeignIronwind(),
      new ForeignIronwind(),
      new PalmVortex(),
      new PalmVortex(),
    ];
    super({ cards, burstCost: 3 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
