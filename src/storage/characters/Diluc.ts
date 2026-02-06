import { CharacterUseBurstContext } from "../../types/functionsContext";
import { TemperedSword } from "../cards/Diluc/TemperedSword";
import { SearingOnslaught } from "../cards/Diluc/SearingOnslaught";
import { Character } from "./Character";
import { Attack } from "../../types/general";
import { Pyro } from "../elements/Pyro";

export class Diluc extends Character {
  public get Name() {
    return "Diluc";
  }

  constructor() {
    const cards = [
      new TemperedSword(),
      new TemperedSword(),
      new TemperedSword(),
      new SearingOnslaught(),
      new SearingOnslaught(),
    ];
    super({ cards, burstCost: 7 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (!ctx.selectedEnemy) {
      throw new Error("no enemy");
    }

    const attack: Attack = {
      damage: 6,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    };
    ctx.selectedEnemy.applyAttack(attack);
  }
}
