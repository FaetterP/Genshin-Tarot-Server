import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { WeissBladework } from "../cards/Albedo/WeissBladework";
import { SolarIsotoma } from "../cards/Albedo/SolarIsotoma";
import { Character } from "./Character";

export class Albedo extends Character {
  public get Name() {
    return "Albedo";
  }

  constructor() {
    const cards = [
      new WeissBladework(),
      new WeissBladework(),
      new WeissBladework(),
      new SolarIsotoma(),
      new SolarIsotoma(),
    ];
    super({ cards, burstCost: 6 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    // TODO
  }
}
