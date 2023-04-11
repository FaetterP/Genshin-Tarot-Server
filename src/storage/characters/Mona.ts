import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { RippleOfFate } from "../cards/Mona/RippleOfFate";
import { MirrorReflections } from "../cards/Mona/MirrorReflections";
import { Character } from "./Character";

export class Mona extends Character {
  public get Name() {
    return "Mona";
  }

  constructor() {
    const cards = [
      new RippleOfFate(),
      new RippleOfFate(),
      new RippleOfFate(),
      new MirrorReflections(),
      new MirrorReflections(),
    ];
    super({ cards, burstCost: 3 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if(!ctx.selectedCharacter){
      throw new Error("need selectedCharacter")
    }

    // TODO if top deck is selectedCharacter deal 5 piercing damage
  }
}
