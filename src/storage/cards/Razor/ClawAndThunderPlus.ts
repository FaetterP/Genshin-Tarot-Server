import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { UseableCard } from "../UseableCard";

export class ClawAndThunderPlus extends UseableCard {
  public get Name(): string {
    return "ClawAndThunderPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Electro(), ctx.player);
    }

    // TODO
  }
}
