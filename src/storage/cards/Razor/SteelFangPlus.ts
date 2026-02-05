import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SteelFangPlus extends Card {
  public get Name(): string {
    return "SteelFangPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: "enemy_change_shield", enemyId: target.ID, delta: -1 },
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 2,
        isPiercing: false,
      },
    ]);
    target.addShields(-1);
    target.applyAttack({ damage: 2, player: ctx.player });
    // TODO
  }
}
