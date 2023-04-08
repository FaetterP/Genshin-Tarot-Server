import { CardUseContext } from "../../../../types/functionsContext";
import { NiwabiFireDanceEffect } from "../../effects/NiwabiFireDanceEffect";
import { Card } from "../Card";

export class NiwabiFireDancePlus extends Card {
  public get Name(): string {
    return "NiwabiFireDancePlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();
    ctx.player.drawCard();

    ctx.player.addEffect(new NiwabiFireDanceEffect());
  }
}
