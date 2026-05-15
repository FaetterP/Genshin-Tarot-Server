import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { OceanbornPlus } from "./OceanbornPlus";

export class Oceanborn extends Card {
  public get Name(): ECard {
    return ECard.Oceanborn;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return OceanbornPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];

    if (target.Shield > 0) {
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemyChangeShield,
          enemyId: target.ID,
          delta: -1,
        },
      ]);
      target.addShields(-1);
    } else {
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: target.ID,
          damage: 2,
          isPiercing: false,
        },
      ]);
      target.applyAttack({ damage: 2, player: ctx.player });
    }

    if (ctx.isUseAlternative && ctx.player.ActionPoints.total >= 2 && ctx.player.trySpendActonPoints(1)) {
      if (target.Shield > 0) {
        ctx.addToSteps([
          {
            type: EDetailedStep.EnemyChangeShield,
            enemyId: target.ID,
            delta: -1,
          },
        ]);
        target.addShields(-1);
      } else {
        ctx.addToSteps([
          {
            type: EDetailedStep.EnemyTakeDamage,
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
