import { CardUseContext } from "../../../types/functionsContext";
import { TrailOfTheQilinEffect } from "../../effects/TrailOfTheQilinEffect";
import { Card } from "../Card";
import { TrailOfTheQilinPlus } from "./TrailOfTheQilinPlus";

export class TrailOfTheQilin extends Card {
  public get Name(): string {
    return "TrailOfTheQilin";
  }

  constructor() {
    super(2);
  }

  get Upgrade() {
    return TrailOfTheQilinPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const effect = new TrailOfTheQilinEffect();
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
