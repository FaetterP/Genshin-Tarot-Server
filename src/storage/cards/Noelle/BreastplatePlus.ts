import { CardUseContext } from "../../../../types/functionsContext";
import { Geo } from "../../elements/Geo";
import { UseableCard } from "../UseableCard";

export class BreastplatePlus extends UseableCard {
  public get Name(): string {
    return "BreastplatePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }

    // TODO normal attacks heal
  }
}
