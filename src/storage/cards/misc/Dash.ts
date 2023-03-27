import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class Dash extends UseableCard {
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
