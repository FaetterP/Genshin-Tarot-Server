import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class RagingTide extends Card {
  public get Name(): string {
    return "RagingTide";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();
    ctx.player.drawCard();

    // TODO may drop 3 cards and apply Hydro to one enemy per card
  }
}
