import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class MaidsBladeworkPlus extends Card {
  public get Name(): string {
    return "MaidsBladeworkPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();
    ctx.player.drawCard();

    ctx.player.addShield(2);
  }
}
