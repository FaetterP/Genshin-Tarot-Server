import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { getRandomInteger } from "../../../utils/math";
import { Card } from "../Card";

export class CeremonialBladeworkPlus extends Card {
  public get Name(): string {
    return "CeremonialBladeworkPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 2 + getRandomInteger(1, 7);
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: false,
      },
    ]);
    target.applyAttack({ damage, player: ctx.player });
  }
}
