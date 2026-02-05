import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";
import { TemperedSwordPlus } from "./TemperedSwordPlus";

export class TemperedSword extends Card {
  public get Name(): string {
    return "TemperedSword";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return TemperedSwordPlus;
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

    if (ctx.isUseAlternative && ctx.player.trySpendActonPoints(1)) {
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
    }
  }
}
