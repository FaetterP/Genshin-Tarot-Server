import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { EElement, ETypeCard } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class GaleBladePlus extends Card {
  public get Name(): string {
    return "GaleBladePlus";
  }

  constructor() {
    super(0, ETypeCard.Skill);
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
        element: EElement.Anemo,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.player,
    });
    // TODO
  }
}
