import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Attack } from "../../game/Attack";
import { Card } from "../cards/Card";
import { Geo } from "../elements/Geo";
import { Character } from "./Character";

export class NingGuang extends Character {
  public get Name() {
    return "NingGuang";
  }

  constructor() {
    const cards: Card[] = [
      // TODO
    ];
    super({ cards, burstCost: 7 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (!ctx.selectedEnemy) {
      throw new Error("enemy not selected");
    }

    if (ctx.selectedEnemy.Elements[0] instanceof Geo) {
      const attackSetup = { damage: 9, isRange: true, player: ctx.player };
      const attack = new Attack(attackSetup);

      ctx.selectedEnemy.applyAttack(attack);
    } else {
        const attackSetup = { damage: 3, isRange: true, player: ctx.player };
        const attack = new Attack(attackSetup);
        
        ctx.selectedEnemy.applyAttack(attack);
    }
  }
}
