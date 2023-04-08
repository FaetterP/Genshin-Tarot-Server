import { CardUseContext } from "../../../../types/functionsContext";
import { LayeredFrostEffect } from "../../effects/LayeredFrostEffect";
import { Card } from "../Card";

export class LayeredFrostPlus extends Card {
  public get Name(): string {
    return "LayeredFrostPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard();

    ctx.player.addEffect(new LayeredFrostEffect());
  }
}
