import { CardUseContext } from "../../../types/functionsContext";
import { ExplosivePuppetEffect } from "../../effects/ExplosivePuppetEffect";
import { Card } from "../Card";
import { ExplosivePuppetPlus } from "./ExplosivePuppetPlus";

export class ExplosivePuppet extends Card {
  public get Name(): string {
    return "ExplosivePuppet";
  }

  constructor() {
    super(2);
  }

  get Upgrade() {
    return ExplosivePuppetPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    if (ctx.player.Enemies.includes(ctx.enemies[0]))
      throw new Error("enemy is not in range");

    const effect = new ExplosivePuppetEffect();
    ctx.addToSteps([
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.player.addEffect(effect);

    // TODO: not apply to boss
    ctx.enemies[0].addStun();
  }
}
