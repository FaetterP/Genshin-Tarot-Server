import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class SignedEdict extends Card {
  public get Name(): string {
    return "SignedEdict";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
