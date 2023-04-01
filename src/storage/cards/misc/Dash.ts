import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class Dash extends UseableCard {
  public get Name(): string {
    return "Dash";
  }

  constructor() {
    const cost = 0;
    super(cost);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();

    // TODO add 1 extra action point
  }
}
