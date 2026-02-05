import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";
import { WhirlwindThrustPlus } from "./WhirlwindThrustPlus";

export class WhirlwindThrust extends Card {
  public get Name(): string {
    return "WhirlwindThrust";
  }

  constructor() {
    super(0);
  }

  get Upgrade() {
    return WhirlwindThrustPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const e0 = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: e0.ID,
        damage: 1,
        isPiercing: true,
      },
    ]);
    e0.applyAttack({ damage: 1, isPiercing: true, player: ctx.player });

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      if (ctx.enemies.length <= 2) {
        throw new Error("need 2 enemies");
      }
      if (ctx.enemies[0] === ctx.enemies[1]) {
        throw new Error("need 2 different enemies");
      }
      const e1 = ctx.enemies[1];
      ctx.addToSteps([
        {
          type: "enemy_take_damage",
          enemyId: e1.ID,
          damage: 1,
          isPiercing: true,
        },
      ]);
      e1.applyAttack({
        damage: 1,
        isPiercing: true,
        isRange: true,
        player: ctx.player,
      });
    }
  }
}
