import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class MaidsBladeworkPlus extends Card {
  public get Name(): ECard {
    return ECard.MaidsBladeworkPlus;
  }

  constructor() {
    super(0, ECardType.Attack);
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
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    ctx.player.addShield(2);
  }
}
