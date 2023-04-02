import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class RagingTide extends UseableCard {
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
