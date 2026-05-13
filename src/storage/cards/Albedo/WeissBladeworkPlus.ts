import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { SolarIsotomaEffect } from "../../effects/SolarIsotomaEffect";
import { Card } from "../Card";

export class WeissBladeworkPlus extends Card {
  public get Name(): ECard {
    return ECard.WeissBladeworkPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 3;

    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: false,
      },
    ]);

    const attack: Attack = { damage, player: ctx.player };
    target.applyAttack(attack);

    if (ctx.player.isContainsEffect(new SolarIsotomaEffect())) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addExtraActionPoints(1);
      const drawn = ctx.player.drawCard();
      ctx.addToSteps([
        {
          type: EDetailedStep.DrawCards,
          playerId: ctx.player.ID,
          cards: [drawn.getPrimitive()],
        },
      ]);
    }
  }
}
