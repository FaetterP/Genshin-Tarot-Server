import { v4 } from "uuid";

export abstract class Card {
  public readonly ID: string;
  public readonly Cost: number;

  constructor(cost: number) {
    this.Cost = cost;
    this.ID = `card-${v4()}`;
  }
}
