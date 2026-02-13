import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { DanceOfFirePlus } from "./DanceOfFirePlus";

export class DanceOfFire extends Card {
  public get Name(): ECard {
    return ECard.DanceOfFire;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return DanceOfFirePlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    if (target.Shield > 0) {
      ctx.addToSteps([{ type: EDetailedStep.EnemyChangeShield, enemyId: target.ID, delta: -1 }]);
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

    if (ctx.isUseAlternative && ctx.player.trySpendActonPoints(1)) {
      if (target.Shield > 0) {
        ctx.addToSteps([{ type: EDetailedStep.EnemyChangeShield, enemyId: target.ID, delta: -1 }]);
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
