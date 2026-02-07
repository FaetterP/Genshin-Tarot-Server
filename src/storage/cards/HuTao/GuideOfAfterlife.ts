import { CardUseContext } from "../../../types/functionsContext";
import { GuideOfAfterlifeEffect } from "../../effects/GuideOfAfterlifeEffect";
import { Card } from "../Card";
import { GuideOfAfterlifePlus } from "./GuideOfAfterlifePlus";

export class GuideOfAfterlife extends Card {
  public get Name(): string {
    return "GuideOfAfterlife";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return GuideOfAfterlifePlus;
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      {
        type: "player_take_damage",
        playerId: ctx.player.ID,
        damage: 1,
        isPiercing: false,
      },
    ]);
    ctx.player.applyDamage(1);

    if (ctx.isUseAlternative) {
      const c1 = ctx.player.drawCard();
      const c2 = ctx.player.drawCard();
      ctx.addToSteps([
        {
          type: "draw_cards",
          playerId: ctx.player.ID,
          cards: [
            c1.getPrimitive(),
            c2.getPrimitive(),
          ],
        },
      ]);
    } else {
      ctx.addToSteps([
        {
          type: "player_change_energy",
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addEnergy(1);
    }
    const effect = new GuideOfAfterlifeEffect();
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
