import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class SolarIsotoma extends Card {
  public get Name(): string {
    return "SolarIsotoma";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
