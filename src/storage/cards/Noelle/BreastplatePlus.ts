import { CardUseContext } from "../../../../types/functionsContext";
import { BreastplateEffect } from "../../effects/BreastplateEffect";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class BreastplatePlus extends Card {
  public get Name(): string {
    return "BreastplatePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }

    ctx.player.addEffect(new BreastplateEffect());
  }
}
