import { Player } from "../../../Player";
import { UseableCard } from "../UseableCard";

export class Overheat extends UseableCard {
  constructor() {
    const cost = 0;
    super(cost);
  }

  use(ctx: { player: Player }): void {
    ctx.player.drawCard();
    ctx.player.drawCard();

    // TODO
  }
}
