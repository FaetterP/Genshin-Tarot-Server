import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Card } from "../Card";
import { GaryuuBladeworkPlus } from "./GaryuuBladeworkPlus";

export class GaryuuBladework extends Card {
  public get Name(): string {
    return "GaryuuBladework";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return GaryuuBladeworkPlus;
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
        damage: 3,
        isPiercing: false,
      },
    ]);
    target.applyAttack({ damage: 3, player: ctx.player });
  }
}
