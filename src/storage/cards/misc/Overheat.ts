import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class Overheat extends Card {
  public get Name(): string {
    return "Overheat";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();

    // TODO
  }
}
