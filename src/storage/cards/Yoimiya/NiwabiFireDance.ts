import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class NiwabiFireDance extends Card {
  public get Name(): string {
    return "NiwabiFireDance";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
