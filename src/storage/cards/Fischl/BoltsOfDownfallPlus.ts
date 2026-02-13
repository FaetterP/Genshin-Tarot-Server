import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class BoltsOfDownfallPlus extends Card {
  public get Name(): ECard {
    return ECard.BoltsOfDownfallPlus;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = target.wasHitByNightriderEffectThisTurn ? 3 : 1;
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
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };
    target.applyAttack(attack);
  }
}
