import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { LemniscaticWindPlus } from "./LemniscaticWindPlus";

export class LemniscaticWind extends Card {
  public get Name(): string {
    return "LemniscaticWind";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return LemniscaticWindPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element: "Anemo",
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.player,
    });
    if (ctx.isUseAlternative) {
      // TODO return card to hand
    }
  }
}
