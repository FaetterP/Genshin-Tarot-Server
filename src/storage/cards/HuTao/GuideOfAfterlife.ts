import { CardUseContext } from "../../../../types/functionsContext";
import { GuideOfAfterlifeEffect } from "../../effects/GuideOfAfterlifeEffect";
import { Card } from "../Card";

export class GuideOfAfterlife extends Card {
  public get Name(): string {
    return "GuideOfAfterlife";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.player.applyDamage(1);

    if (ctx.isUseAlternative) {
      ctx.player.drawCard();
      ctx.player.drawCard();
    } else {
      ctx.player.addEnergy(1);
    }

    ctx.player.addEffect(new GuideOfAfterlifeEffect());
  }
}
