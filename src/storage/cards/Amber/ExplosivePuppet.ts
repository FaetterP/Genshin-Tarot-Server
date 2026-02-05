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

    const effect = new ExplosivePuppetEffect();
    ctx.addToSteps([
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.enemies[0].addStun();
    ctx.player.addEffect(effect);
  }
}
