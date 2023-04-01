import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class Dash extends UseableCard {
  public get Name(): string {
    return "Dash";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();

    ctx.player.addActionPoints(1);
  }
}
