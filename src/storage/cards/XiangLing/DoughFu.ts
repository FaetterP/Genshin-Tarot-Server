import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { DoughFuPlus } from "./DoughFuPlus";

export class DoughFu extends Card {
  public get Name(): ECard {
    return ECard.DoughFu;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return DoughFuPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const e0 = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
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
          type: EDetailedStep.EnemyTakeDamage,
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
