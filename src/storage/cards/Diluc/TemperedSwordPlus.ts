import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class TemperedSwordPlus extends Card {
  public get Name(): ECard {
    return ECard.TemperedSwordPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
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
          delta: -target.Shield,
        },
      ]);
      target.addShields(-Infinity);
    } else {
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: target.ID,
          damage: 4,
          isPiercing: false,
        },
      ]);
      target.applyAttack({ damage: 4, player: ctx.player });
    }
  }
}
