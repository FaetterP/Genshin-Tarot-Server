import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class Freeze extends Card {
  public get Name(): string {
    return "Freeze";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    // TODO drop all Freeze in hand
  }
}
