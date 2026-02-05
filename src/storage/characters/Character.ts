import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Card } from "../cards/Card";

export abstract class Character {
  public abstract get Name(): string;
  private cards: Card[];
  private burstCost: number;

  public get Cards(): ReadonlyArray<Card> {
    return this.cards;
  }

  public get BurstCost(): number {
    return this.burstCost;
  }

  constructor({ cards, burstCost }: { cards: Card[]; burstCost: number }) {
    this.cards = cards;
    this.burstCost = burstCost;
  }

  public tryUseBurst(ctx: CharacterUseBurstContext) {
    if (ctx.player.trySpendEnergy(this.burstCost)) {
      this.useBurst(ctx);
      return true;
    }
    return false;
  }

  abstract useBurst(ctx: CharacterUseBurstContext): void;
}
