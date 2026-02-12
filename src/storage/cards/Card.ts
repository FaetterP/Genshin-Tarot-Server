import { v4 } from "uuid";
import type { CardPrimitive } from "../../types/general";
import { ETypeCard } from "../../types/enums";
import { CardUseContext } from "../../types/functionsContext";

export abstract class Card {
  public abstract get Name(): string;
  public readonly ID: string;
  public readonly Cost: number;
  public readonly Type: ETypeCard;

  public deckPosition: number = 0;
  public revealDeckPositionToClient: boolean = false;

  constructor(cost: number, type: ETypeCard) {
    this.Cost = cost;
    this.Type = type;
    this.ID = `card-${v4()}`;
  }

  public get Upgrade(): (new () => Card) | null {
    return null;
  }

  public getPrimitive(): CardPrimitive {
    const base = { cardId: this.ID, name: this.Name, type: this.Type };
    if (this.revealDeckPositionToClient) {
      return { ...base, deckPosition: this.deckPosition };
    }
    return base;
  }

  abstract use(ctx: CardUseContext): void;
}
