import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { CeremonialBladeworkPlus } from "./CeremonialBladeworkPlus";

export class CeremonialBladework extends Card {
  public get Name(): ECard {
    return ECard.CeremonialBladework;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return CeremonialBladeworkPlus;
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
