import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class Burn extends UseableCard {
  public get Name(): string {
    return "Burn";
  }

  constructor() {
    super(Number.MAX_SAFE_INTEGER);
  }

  use(ctx: CardUseContext): void {}
}
