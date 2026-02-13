import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class KaboomPlus extends Card {
  public get Name(): ECard {
    return ECard.KaboomPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = ctx.isUseAlternative && ctx.player.trySpendEnergy(2) ? 4 : 2;
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: true,
        element: EElement.Pyro,
      },
    ]);
    target.applyAttack({
      damage,
      isPiercing: true,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    });
  }
}
