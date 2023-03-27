import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Card } from "../cards/Card";

export abstract class Character {
  private cards: Card[];
  private burstCost: number;

  constructor({ cards, burstCost }: { cards: Card[]; burstCost: number }) {
    this.cards = cards;
    this.burstCost = burstCost;
  }

  public tryUseBurst(ctx: CharacterUseBurstContext) {
    if (ctx.player.ActionPoints.total >= this.burstCost) {
      ctx.player.addActionPoints(-this.burstCost);
      this.useBurst(ctx);
      return true;
    }
    return false;
  }

  abstract useBurst(ctx: CharacterUseBurstContext): void;
}
