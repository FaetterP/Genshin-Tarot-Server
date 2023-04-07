import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class BalefulOmenPlus extends UseableCard {
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
