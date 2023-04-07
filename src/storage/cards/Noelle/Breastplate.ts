import { CardUseContext } from "../../../../types/functionsContext";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class Breastplate extends Card {
  public get Name(): string {
    return "Breastplate";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }

    ctx.player.addHealth(1);
  }
}
