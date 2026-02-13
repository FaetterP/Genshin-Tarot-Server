import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { SealOfApprovalPlus } from "./SealOfApprovalPlus";

export class SealOfApproval extends Card {
  public get Name(): ECard {
    return ECard.SealOfApproval;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return SealOfApprovalPlus;
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
        damage: 1,
        isPiercing: true,
        element: EElement.Pyro,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    });
  }
}
