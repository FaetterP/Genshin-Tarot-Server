import { CharacterUseBurstContext } from "../../types/functionsContext";
import { FireworkFlareUp } from "../cards/Yoimiya/FireworkFlareUp";
import { NiwabiFireDance } from "../cards/Yoimiya/NiwabiFireDance";
import { ECharacter } from "../../types/enums";
import { Character } from "./Character";

export class Yoimiya extends Character {
  public get Name() {
    return ECharacter.Yoimiya;
  }

  constructor() {
    const cards = [
      new FireworkFlareUp(),
      new FireworkFlareUp(),
      new FireworkFlareUp(),
      new NiwabiFireDance(),
      new NiwabiFireDance(),
    ];
    super({ cards, burstCost: 4 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
