import { CharacterUseBurstContext } from "../../types/functionsContext";
import { SteelFang } from "../cards/Razor/SteelFang";
import { ClawAndThunder } from "../cards/Razor/ClawAndThunder";
import { ECharacter } from "../../types/enums";
import { Character } from "./Character";

export class Razor extends Character {
  public get Name() {
    return ECharacter.Razor;
  }

  constructor() {
    const cards = [
      new SteelFang(),
      new SteelFang(),
      new SteelFang(),
      new ClawAndThunder(),
      new ClawAndThunder(),
    ];
    super({ cards, burstCost: 5 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
