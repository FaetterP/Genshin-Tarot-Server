import { CardUseContext } from "../../../types/functionsContext";
import { ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class Burn extends Card {
  public get Name(): string {
    return "Burn";
  }

  constructor() {
    super(Number.MAX_SAFE_INTEGER, ECardType.Other);
  }

  use(ctx: CardUseContext): void {
    throw new Error("card cannot be used");
  }
}
