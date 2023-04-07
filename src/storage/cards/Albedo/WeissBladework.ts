import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class WeissBladework extends Card {
  public get Name(): string {
    return "WeissBladework";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
