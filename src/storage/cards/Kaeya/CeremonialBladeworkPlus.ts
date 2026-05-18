import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { getRandomInteger } from "../../../utils/math";
import { Card } from "../Card";

export class CeremonialBladeworkPlus extends Card {
  public get Name(): ECard {
    return ECard.CeremonialBladeworkPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 2 + getRandomInteger(1, 6);
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: false,
      },
    ]);
    target.applyAttack({ damage, player: ctx.player });
  }
}
