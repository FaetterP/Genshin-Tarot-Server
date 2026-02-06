import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Origin } from "../cards/Raiden/Origin";
import { BalefulOmen } from "../cards/Raiden/BalefulOmen";
import { Character } from "./Character";

export class Raiden extends Character {
  public get Name() {
    return "Raiden";
  }

  constructor() {
    const cards = [
      new Origin(),
      new Origin(),
      new Origin(),
      new BalefulOmen(),
      new BalefulOmen(),
    ];
    super({ cards, burstCost: 10 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
