import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class SealOfApprovalPlus extends Card {
  public get Name(): ECard {
    return ECard.SealOfApprovalPlus;
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
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 2,
        isPiercing: true,
        element: EElement.Pyro,
      },
    ]);
    target.applyAttack({
      damage: 2,
      isPiercing: true,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    });
    // TODO
  }
}
