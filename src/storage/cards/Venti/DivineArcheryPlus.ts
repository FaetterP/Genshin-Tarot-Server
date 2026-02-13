import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class DivineArcheryPlus extends Card {
  public get Name(): ECard {
    return ECard.DivineArcheryPlus;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = ctx.isUseAlternative && ctx.player.trySpendEnergy(1) ? 3 : 1;
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: true,
      },
    ]);
    target.applyAttack({
      damage,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    });
  }
}
