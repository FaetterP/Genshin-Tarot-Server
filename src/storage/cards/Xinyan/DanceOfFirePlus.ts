import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class DanceOfFirePlus extends Card {
  public get Name(): ECard {
    return ECard.DanceOfFirePlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    const damage = ctx.player.Shields > 0 ? 3 : 1;
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.ID,
        damage,
        isPiercing: false,
      })),
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyAttack({
        damage,
        player: ctx.player,
      });
    }
  }
}
