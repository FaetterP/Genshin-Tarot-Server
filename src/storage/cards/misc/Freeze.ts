import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class Freeze extends UseableCard {
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
