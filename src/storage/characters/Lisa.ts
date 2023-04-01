import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Card } from "../cards/Card";
import { Electro } from "../elements/Electro";
import { Character } from "./Character";

export class Lisa extends Character {
  public get Name() {
    return "Lisa";
  }

  constructor() {
    const cards: Card[] = [
      // TODO
    ];
    super({ cards, burstCost: 3 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();

    if (!ctx.selectedEnemy) {
      throw new Error("player not selected");
    }

    ctx.selectedEnemy.applyElement(new Electro(), ctx.player);
  }
}
