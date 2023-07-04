import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { Overheat } from "../misc/Overheat";

export class TidecallerPlus extends Card {
  public get Name(): string {
    return "TidecallerPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Electro(), ctx.player);
    }

    ctx.player.addShield(3);
    ctx.player.addCardToHand(new Overheat());
  }
}
