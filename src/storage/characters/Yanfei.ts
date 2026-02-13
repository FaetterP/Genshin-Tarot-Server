import { CharacterUseBurstContext } from "../../types/functionsContext";
import { SealOfApproval } from "../cards/Yanfei/SealOfApproval";
import { SignedEdict } from "../cards/Yanfei/SignedEdict";
import { ECharacter } from "../../types/enums";
import { Character } from "./Character";

export class Yanfei extends Character {
  public get Name() {
    return ECharacter.Yanfei;
  }

  constructor() {
    const cards = [
      new SealOfApproval(),
      new SealOfApproval(),
      new SealOfApproval(),
      new SignedEdict(),
      new SignedEdict(),
    ];
    super({ cards, burstCost: 3 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
