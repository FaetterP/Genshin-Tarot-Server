import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { GaryuuBladeworkPlus } from "./GaryuuBladeworkPlus";

export class GaryuuBladework extends Card {
  public get Name(): ECard {
    return ECard.GaryuuBladework;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return GaryuuBladeworkPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 3,
        isPiercing: false,
      },
    ]);
    target.applyAttack({ damage: 3, player: ctx.player });
  }
}
