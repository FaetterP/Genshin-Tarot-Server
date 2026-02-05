import type { DetailedStep } from "../../../../types/detailedStep";
import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";
import { MirrorReflections } from "./MirrorReflections";
import { MirrorReflectionsPlus } from "./MirrorReflectionsPlus";
import { RippleOfFate } from "./RippleOfFate";

export class RippleOfFatePlus extends Card {
  public get Name(): string {
    return "RippleOfFatePlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    const drawn: { cardId: string; name: string }[] = [];
    for (let i = 0; i < 2; i++) {
      const card = ctx.player.drawCard();
      drawn.push({ cardId: card.ID, name: card.Name });
      if (
        card instanceof RippleOfFate ||
        card instanceof RippleOfFatePlus ||
        card instanceof MirrorReflections ||
        card instanceof MirrorReflectionsPlus
      ) {
        ctx.addToSteps([{
          type: "player_change_energy",
          playerId: ctx.player.ID,
          delta: 2,
        }]);
        ctx.player.addEnergy(2);
      }
    }
    ctx.addToSteps([
      { type: "draw_cards", playerId: ctx.player.ID, cards: drawn },
    ]);
  }
}
