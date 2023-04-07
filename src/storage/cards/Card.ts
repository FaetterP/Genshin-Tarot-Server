import { v4 } from "uuid";
import { CardUseContext } from "../../../types/functionsContext";

export abstract class Card {
  public abstract get Name(): string;
  public readonly ID: string;
  public readonly Cost: number;

  constructor(cost: number) {
    this.Cost = cost;
    this.ID = `card-${v4()}`;
  }

  abstract use(ctx: CardUseContext): void;
}
