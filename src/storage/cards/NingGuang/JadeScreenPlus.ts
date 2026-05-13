import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class JadeScreenPlus extends Card {
  public get Name(): ECard {
    return ECard.JadeScreenPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    if (ctx.selectedPlayer) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "shield",
          playerId: ctx.selectedPlayer.ID,
          delta: 3,
        },
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.selectedPlayer.ID,
          delta: 1,
        },
      ]);
      ctx.selectedPlayer.addShield(3);
      ctx.selectedPlayer.addEnergy(1);
    }
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: ctx.player.ID,
        delta: 3,
      },
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: ctx.player.ID,
        delta: 1,
      },
    ]);

    ctx.player.addShield(3);
    ctx.player.addEnergy(1);
  }
}
