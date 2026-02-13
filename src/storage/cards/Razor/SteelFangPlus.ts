import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class SteelFangPlus extends Card {
  public get Name(): ECard {
    return ECard.SteelFangPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: EDetailedStep.EnemyChangeShield, enemyId: target.ID, delta: -1 },
      {
        type: EDetailedStep.EnemyTakeDamage,
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
