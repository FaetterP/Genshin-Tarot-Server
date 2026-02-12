import { CardUseContext } from "../../../types/functionsContext";
import { ETypeCard } from "../../../types/enums";
import { Card } from "../Card";

export class Burn extends Card {
  public get Name(): string {
    return "Burn";
  }

  constructor() {
    super(Number.MAX_SAFE_INTEGER, ETypeCard.Other);
  }

  use(ctx: CardUseContext): void {
    throw new Error("card cannot be used");
  }
}
