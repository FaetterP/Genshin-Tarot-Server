import { CharacterUseBurstContext } from "../../types/functionsContext";
import { DanceOfFire } from "../cards/Xinyan/DanceOfFire";
import { SweepingFervor } from "../cards/Xinyan/SweepingFervor";
import { ECharacter } from "../../types/enums";
import { Character } from "./Character";

export class Xinyan extends Character {
  public get Name() {
    return ECharacter.Xinyan;
  }

  constructor() {
    const cards = [
      new DanceOfFire(),
      new DanceOfFire(),
      new DanceOfFire(),
      new SweepingFervor(),
      new SweepingFervor(),
    ];
    super({ cards, burstCost: 6 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
