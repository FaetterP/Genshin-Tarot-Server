import { CardUseContext } from "../../../../types/functionsContext";
import { ExplosivePuppetEffect } from "../../effects/ExplosivePuppetEffect";
import { Card } from "../Card";

export class ExplosivePuppetPlus extends Card {
  public get Name(): string {
    return "ExplosivePuppetPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    ctx.enemies[0].addStun();

    ctx.player.addEffect(new ExplosivePuppetEffect());
  }
}
