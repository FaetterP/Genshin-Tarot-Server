import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class MaidsBladeworkPlus extends UseableCard {
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
