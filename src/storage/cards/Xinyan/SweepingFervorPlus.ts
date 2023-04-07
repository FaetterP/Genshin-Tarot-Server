import { CardUseContext } from "../../../../types/functionsContext";
import { Pyro } from "../../elements/Pyro";
import { UseableCard } from "../UseableCard";

export class SweepingFervorPlus extends UseableCard {
  public get Name(): string {
    return "SweepingFervorPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.addShield(3);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Pyro(), ctx.player);
    }
  }
}
