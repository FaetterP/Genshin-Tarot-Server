import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType, EElement } from "../../../types/enums";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class RainOfStone extends Card {
  public get Name(): ECard {
    return ECard.RainOfStonePlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      element: new Geo(),
      player: ctx.player,
    };
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: ctx.enemies[0].ID,
        damage: 2,
        isPiercing: true,
        element: EElement.Geo,
      },
    ]);
    ctx.enemies[0].applyAttack(attack);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      ctx.addToSteps([
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
