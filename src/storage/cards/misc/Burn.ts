import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "../Card";

export class Burn extends Card {
  public get Name(): string {
    return "Burn";
  }

  constructor() {
    super(Number.MAX_SAFE_INTEGER);
  }

  use(ctx: CardUseContext): void {
    throw new Error("card cannot be used");
  }
}
