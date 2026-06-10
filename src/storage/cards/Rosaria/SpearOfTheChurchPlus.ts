import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType, EElement } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class SpearOfTheChurchPlus extends Card {
  public get Name(): ECard {
    return ECard.SpearOfTheChurchPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 3,
        isPiercing: false,
        element: EElement.Cryo,
      },
    ]);
    target.applyAttack({ damage: 3, player: ctx.player });
    target.applyElement(new Cryo(), ctx.player);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: -1,
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
