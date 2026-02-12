import { CardUseContext } from "../../../types/functionsContext";
import { NiwabiFireDanceEffect } from "../../effects/NiwabiFireDanceEffect";
import { ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { NiwabiFireDancePlus } from "./NiwabiFireDancePlus";

export class NiwabiFireDance extends Card {
  public get Name(): string {
    return "NiwabiFireDance";
  }

  constructor() {
    super(0, ECardType.Skill);
  }

  get Upgrade() {
    return NiwabiFireDancePlus;
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
