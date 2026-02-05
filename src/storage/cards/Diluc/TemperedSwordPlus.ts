import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class TemperedSwordPlus extends Card {
  public get Name(): string {
    return "TemperedSwordPlus";
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
        {
          type: "enemy_change_shield",
          enemyId: target.ID,
          delta: -target.Shield,
        },
      ]);
      target.addShields(-Infinity);
    } else {
      ctx.addToSteps([
        {
          type: "enemy_take_damage",
          enemyId: target.ID,
          damage: 4,
          isPiercing: false,
        },
      ]);
      target.applyAttack({ damage: 4, player: ctx.player });
    }
  }
}
