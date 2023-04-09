import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { StrikeOfFortune } from "../cards/Bennett/StrikeOfFortune";
import { PassionOverload } from "../cards/Bennett/PassionOverload";
import { Character } from "./Character";

export class Bennett extends Character {
  public get Name() {
    return "Bennett";
  }

  constructor() {
    const cards = [
      new StrikeOfFortune(),
      new StrikeOfFortune(),
      new StrikeOfFortune(),
      new PassionOverload(),
      new PassionOverload(),
    ];
    super({ cards, burstCost: 7 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
