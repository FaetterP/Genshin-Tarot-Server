import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class BalefulOmenPlus extends Card {
  public get Name(): string {
    return "BalefulOmenPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
