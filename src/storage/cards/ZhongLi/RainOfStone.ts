import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Card } from "../Card";
import { RainOfStone as RainOfStonePlus } from "./RainOfStonePlus";

export class RainOfStone extends Card {
  public get Name(): string {
    return "RainOfStone";
  }

  constructor() {
    super(0);
  }

  get Upgrade() {
    return RainOfStonePlus;
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
      },
    ]);
    target.applyAttack({ damage: 1, isPiercing: true, player: ctx.player });

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      if (ctx.enemies.length <= 2) {
        throw new Error("need 2 enemies");
      }
      if (ctx.enemies[0] === ctx.enemies[1]) {
        throw new Error("need 2 different enemies");
      }
      ctx.addToSteps([
        {
          type: "enemy_take_damage",
          enemyId: target.ID,
          damage: 1,
          isPiercing: true,
        },
      ]);
      target.applyAttack({
        damage: 1,
        isPiercing: true,
        isRange: true,
        player: ctx.player,
      });
    }
  }
}
