import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class SharpshooterPlus extends Card {
  public get Name(): ECard {
    return ECard.SharpshooterPlus;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = target.Shield === 0 ? 3 : 1;

    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: true,
      },
    ]);

    const attack: Attack = {
      damage,
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };
    target.applyAttack(attack);
  }
}
