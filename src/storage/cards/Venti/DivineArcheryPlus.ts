import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class DivineArcheryPlus extends Card {
  public get Name(): string {
    return "DivineArcheryPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage =
      ctx.isUseAlternative && ctx.player.trySpendEnergy(1) ? 3 : 1;
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: true,
      },
    ]);
    target.applyAttack({
      damage,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    });
  }
}
