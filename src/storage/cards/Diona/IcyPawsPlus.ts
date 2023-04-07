import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { UseableCard } from "../UseableCard";

export class IcyPawsPlus extends UseableCard {
  public get Name(): string {
    return "IcyPawsPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.player.addShield(3);

    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }

    // Discard all burn cards
  }
}
