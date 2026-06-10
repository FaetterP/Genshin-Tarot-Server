import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { OriginPlus } from "./OriginPlus";

export class Origin extends Card {
  public get Name(): ECard {
    return ECard.Origin;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return OriginPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    if (ctx.isUseAlternative && ctx.player.Energy < 2) {
      throw new Error("not enough energy");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([{
      type: EDetailedStep.EnemyTakeDamage,
      enemyId: target.ID,
      damage: 2,
      isPiercing: false,
    }]);
    const attack: Attack = { damage: 2, player: ctx.player };
    target.applyAttack(attack);

    if (ctx.isUseAlternative) {
      ctx.player.trySpendEnergy(2);
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: -2,
        },
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addExtraActionPoints(1);
    }
  }
}
