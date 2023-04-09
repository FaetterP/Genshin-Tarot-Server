import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { MaidsBladework } from "../cards/Noelle/MaidsBladework";
import { Breastplate } from "../cards/Noelle/Breastplate";
import { Character } from "./Character";
import { Attack } from "../../../types/general";

export class Kaeya extends Character {
  public get Name() {
    return "Kaeya";
  }

  constructor() {
    const cards = [
      new MaidsBladework(),
      new MaidsBladework(),
      new MaidsBladework(),
      new Breastplate(),
      new Breastplate(),
    ];
    super({ cards, burstCost: 3 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (!ctx.selectedEnemy) {
      throw new Error("no enemy");
    }

    const attack: Attack = { damage: ctx.player.Shields, player: ctx.player };
    ctx.selectedEnemy.applyAttack(attack);
  }
}
