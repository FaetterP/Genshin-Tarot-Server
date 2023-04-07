import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class WeissBladeworkPlus extends Card {
  public get Name(): string {
    return "WeissBladeworkPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
