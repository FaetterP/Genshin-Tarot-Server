import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class ClawAndThunderPlus extends Card {
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
