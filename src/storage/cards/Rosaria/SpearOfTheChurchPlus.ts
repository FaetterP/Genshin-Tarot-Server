import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
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

    const attack: Attack = {
      damage: 3,
      element: new Cryo(),
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
