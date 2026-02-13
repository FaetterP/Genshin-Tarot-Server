import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class DoughFuPlus extends Card {
  public get Name(): ECard {
    return ECard.DoughFuPlus;
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
      element: new Pyro(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerChangeActionPoints,
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addExtraActionPoints(1);
    }
  }
}
