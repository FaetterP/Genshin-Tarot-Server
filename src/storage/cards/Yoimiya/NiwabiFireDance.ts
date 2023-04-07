import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class NiwabiFireDance extends UseableCard {
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
