import { CardUseContext } from "../../../../types/functionsContext";
import { ExplosivePuppetEffect } from "../../effects/ExplosivePuppetEffect";
import { Card } from "../Card";

export class ExplosivePuppet extends Card {
  public get Name(): string {
    return "ExplosivePuppet";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    ctx.enemies[0].addStun();

    ctx.player.addEffect(new ExplosivePuppetEffect());
  }
}
