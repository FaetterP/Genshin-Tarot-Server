import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SteelFang extends Card {
  public get Name(): string {
    return "SteelFang";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    if (target.Shield > 0) {
      ctx.addToSteps([
        { type: "enemy_change_shield", enemyId: target.ID, delta: -1 },
      ]);
      target.addShields(-1);
    } else {
      ctx.addToSteps([
        {
          type: "enemy_take_damage",
          enemyId: target.ID,
          damage: 2,
          isPiercing: false,
        },
      ]);
      target.applyAttack({ damage: 2, player: ctx.player });
    }
    // TODO
  }
}
