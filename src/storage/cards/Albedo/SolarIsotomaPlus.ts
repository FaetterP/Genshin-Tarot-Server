import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class SolarIsotomaPlus extends Card {
  public get Name(): string {
    return "SolarIsotomaPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
