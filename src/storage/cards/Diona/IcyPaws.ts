import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class IcyPaws extends Card {
  public get Name(): string {
    return "IcyPaws";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.player.addShield(3);

    // TODO or

    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }

    // Discard all burn cards
  }
}
