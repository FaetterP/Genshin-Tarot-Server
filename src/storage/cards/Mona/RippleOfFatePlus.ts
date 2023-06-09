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
    for (let i = 0; i < 2; i++) {
      const card = ctx.player.drawCard();
      if (
        card instanceof RippleOfFate ||
        card instanceof RippleOfFatePlus ||
        card instanceof MirrorReflections ||
        card instanceof MirrorReflectionsPlus
      ) {
        ctx.player.addEnergy(2);
      }
    }
  }
}
