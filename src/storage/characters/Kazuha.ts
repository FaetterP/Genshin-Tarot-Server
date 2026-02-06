import { CharacterUseBurstContext } from "../../types/functionsContext";
import { GaryuuBladework } from "../cards/Kazuha/GaryuuBladework";
import { Chihayaburu } from "../cards/Kazuha/Chihayaburu";
import { Character } from "./Character";

export class Kazuha extends Character {
  public get Name() {
    return "Kazuha";
  }

  constructor() {
    const cards = [
      new GaryuuBladework(),
      new GaryuuBladework(),
      new GaryuuBladework(),
      new Chihayaburu(),
      new Chihayaburu(),
    ];
    super({ cards, burstCost: 6 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
