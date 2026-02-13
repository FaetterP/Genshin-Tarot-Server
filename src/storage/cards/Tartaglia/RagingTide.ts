import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { RagingTidePlus } from "./RagingTidePlus";

export class RagingTide extends Card {
  public get Name(): ECard {
    return ECard.RagingTide;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return RagingTidePlus;
  }

  use(ctx: CardUseContext): void {
    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    const c3 = ctx.player.drawCard();
    ctx.addToSteps([
      {
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [c1.getPrimitive(), c2.getPrimitive(), c3.getPrimitive()],
      },
    ]);
    // TODO may drop 3 cards and apply Hydro to one enemy per card
  }
}
