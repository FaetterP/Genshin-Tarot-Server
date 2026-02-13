import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { JadeScreenPlus } from "./JadeScreenPlus";

export class JadeScreen extends Card {
  public get Name(): ECard {
    return ECard.JadeScreen;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return JadeScreenPlus;
  }

  use(ctx: CardUseContext): void {
    const targetPlayer = ctx.selectedPlayer ?? ctx.player;
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerChangeShield,
        playerId: targetPlayer.ID,
        delta: 3,
      },
    ]);
    targetPlayer.addShield(3);
  }
}
