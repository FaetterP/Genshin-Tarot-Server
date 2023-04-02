import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { UseableCard } from "../UseableCard";

export class FrostgnawPlus extends UseableCard {
  public get Name(): string {
    return "FrostgnawPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }

    ctx.player.addEnergy(2);
    ctx.player.addHealth(2);
  }
}
