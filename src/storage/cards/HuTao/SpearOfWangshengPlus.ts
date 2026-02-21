import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class SpearOfWangsheng extends Card {
  public get Name(): ECard {
    return ECard.SpearOfWangshengPlus;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerTakeDamage,
        playerId: ctx.player.ID,
        damage: 1,
        isPiercing: false,
      },
    ]);
    ctx.player.applyDamage(1);

    const damage = ctx.player.Health <= 7 ? 4 : 1;
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
      player: ctx.player,
    });

    if (ctx.player.Health <= 7) {
      ctx.player.moveCardFromHandToDeck(this);
    }
  }
}
