import { CardUseContext } from "../../../../types/functionsContext";
import { Geo } from "../../elements/Geo";
import { UseableCard } from "../UseableCard";

export class Breastplate extends UseableCard {
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
