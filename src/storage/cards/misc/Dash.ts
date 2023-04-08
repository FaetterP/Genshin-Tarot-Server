import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class Dash extends Card {
  public get Name(): string {
    return "Dash";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();

    ctx.player.addExtraActionPoints(1);
  }
}
