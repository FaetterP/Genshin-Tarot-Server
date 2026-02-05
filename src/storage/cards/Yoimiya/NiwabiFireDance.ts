import { CardUseContext } from "../../../../types/functionsContext";
import { NiwabiFireDanceEffect } from "../../effects/NiwabiFireDanceEffect";
import { Card } from "../Card";

export class NiwabiFireDance extends Card {
  public get Name(): string {
    return "NiwabiFireDance";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    const effect = new NiwabiFireDanceEffect();
    ctx.addToSteps([
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.player.addEffect(effect);
  }
}
