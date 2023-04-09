import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { KatzleinStyle } from "../cards/Diona/KatzleinStyle";
import { IcyPaws } from "../cards/Diona/IcyPaws";
import { Character } from "./Character";

export class Diona extends Character {
  public get Name() {
    return "Diona";
  }

  constructor() {
    const cards = [
      new KatzleinStyle(),
      new KatzleinStyle(),
      new KatzleinStyle(),
      new IcyPaws(),
      new IcyPaws(),
    ];
    super({ cards, burstCost: 5 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
