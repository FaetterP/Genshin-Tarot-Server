import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "../Card";

export class SignedEdictPlus extends Card {
  public get Name(): string {
    return "SignedEdictPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
