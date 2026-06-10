import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class SteelFangPlus extends Card {
  public get Name(): ECard {
    return ECard.SteelFangPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];

    if (target.Shield > 0) {
      ctx.addToSteps([{ type: EDetailedStep.EnemyChangeShield, enemyId: target.ID, delta: -1 }]);
      target.addShields(-1);
    }

    ctx.addToSteps([{
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: target.ID,
      damage: 2,
      isPiercing: false,
    }]);
    target.applyAttack({ damage: 2, player: ctx.player });

    if (ctx.isUseAlternative) {
      if (ctx.player.Energy < 1) throw new Error("not enough energy");
      ctx.player.trySpendEnergy(1);
      ctx.addToSteps([{
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: ctx.player.ID,
        delta: -1,
      }]);
      if (ctx.player.razorPoints < 3) {
        ctx.player.razorPoints += 1;
        ctx.addToSteps([{
          type: EDetailedStep.PlayerStatChange,
          stat: "razorPoints",
          playerId: ctx.player.ID,
          delta: 1,
        }]);
      }
    }
  }
}
