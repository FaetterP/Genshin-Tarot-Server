import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Card } from "../cards/Card";
import { Electro } from "../elements/Electro";
import { Character } from "./Character";
import { LightningTouch } from "../cards/Lisa/LightningTouch";
import { VioletArc } from "../cards/Lisa/VioletArc";

export class Lisa extends Character {
  public get Name() {
    return "Lisa";
  }

  constructor() {
    const cards: Card[] = [
      new LightningTouch(),
      new LightningTouch(),
      new LightningTouch(),
      new VioletArc(),
      new VioletArc(),
    ];
    super({ cards, burstCost: 3 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();

    if (ctx.selectedEnemy) {
      ctx.selectedEnemy.applyElement(new Electro(), ctx.player);
    }
  }
}
