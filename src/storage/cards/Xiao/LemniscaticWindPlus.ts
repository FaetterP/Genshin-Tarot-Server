import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { Dash } from "../misc/Dash";

export class LemniscaticWindPlus extends Card {
  public get Name(): string {
    return "LemniscaticWindPlus";
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = ctx.player.LastCard instanceof Dash ? 5 : 2;
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: true,
        element: EElement.Anemo,
      },
    ]);
    target.applyAttack({
      damage,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.player,
    });
  }
}
