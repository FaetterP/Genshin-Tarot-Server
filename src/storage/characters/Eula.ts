import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { EdelBladework } from "../cards/Eula/EdelBladework";
import { IcetideVortex } from "../cards/Eula/IcetideVortex";
import { Character } from "./Character";

export class Eula extends Character {
  public get Name() {
    return "Eula";
  }

  constructor() {
    const cards = [
      new EdelBladework(),
      new EdelBladework(),
      new EdelBladework(),
      new IcetideVortex(),
      new IcetideVortex(),
    ];
    super({ cards, burstCost: 4 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
