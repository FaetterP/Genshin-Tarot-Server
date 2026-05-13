import type { DetailedStep } from "../../../types/detailedStep";
import type { CardPrimitive } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "../Card";
import { MirrorReflections } from "./MirrorReflections";
import { MirrorReflectionsPlus } from "./MirrorReflectionsPlus";
import { RippleOfFate } from "./RippleOfFate";

export class RippleOfFatePlus extends Card {
  public get Name(): ECard {
    return ECard.RippleOfFatePlus;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    const drawn: CardPrimitive[] = [];
    for (let i = 0; i < 2; i++) {
      const card = ctx.player.drawCard();
      drawn.push(card.getPrimitive());
      if (
        card instanceof RippleOfFate ||
        card instanceof RippleOfFatePlus ||
        card instanceof MirrorReflections ||
        card instanceof MirrorReflectionsPlus
      ) {
        ctx.addToSteps([
          {
            type: EDetailedStep.PlayerStatChange,
            stat: "energy",
            playerId: ctx.player.ID,
            delta: 2,
          },
        ]);
        ctx.player.addEnergy(2);
      }
    }
    ctx.addToSteps([{ type: EDetailedStep.DrawCards, playerId: ctx.player.ID, cards: drawn }]);
  }
}
