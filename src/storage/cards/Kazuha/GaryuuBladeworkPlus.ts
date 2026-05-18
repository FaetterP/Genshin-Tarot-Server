import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class GaryuuBladeworkPlus extends Card {
  public get Name(): ECard {
    return ECard.GaryuuBladeworkPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const lastCardName = ctx.player.LastCard?.Name;
    const damage = lastCardName === ECard.Chihayaburu || lastCardName === ECard.Dash ? 6 : 3;

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
