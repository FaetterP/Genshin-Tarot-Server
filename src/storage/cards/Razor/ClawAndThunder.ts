import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { UseableCard } from "../UseableCard";

export class ClawAndThunder extends UseableCard {
  public get Name(): string {
    return "ClawAndThunder";
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
