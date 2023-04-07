import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class BalefulOmen extends Card {
  public get Name(): string {
    return "BalefulOmen";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
