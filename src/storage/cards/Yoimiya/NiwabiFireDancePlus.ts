import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class NiwabiFireDancePlus extends UseableCard {
  public get Name(): string {
    return "NiwabiFireDancePlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard()
    ctx.player.drawCard()
    ctx.player.drawCard()
    // TODO
  }
}
