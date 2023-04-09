import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Kaboom } from "../cards/Klee/Kaboom";
import { JumpyDumpty } from "../cards/Klee/JumpyDumpty";
import { Character } from "./Character";
import { getRandomInteger } from "../../utils/math";
import { Attack } from "../../../types/general";

export class Klee extends Character {
  public get Name() {
    return "Klee";
  }

  constructor() {
    const cards = [
      new Kaboom(),
      new Kaboom(),
      new Kaboom(),
      new JumpyDumpty(),
      new JumpyDumpty(),
    ];
    super({ cards, burstCost: 4 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (!ctx.selectedEnemy) {
      throw new Error("need selectedEnemy");
    }

    do {
      const attack: Attack = {
        damage: 2,
        isPiercing: true,
        isRange: true,
        player: ctx.player,
      };

      ctx.selectedEnemy.applyAttack(attack);
    } while (getRandomInteger(1, 7) >= 4);
  }
}
