import { CardUseContext } from "../../../../types/functionsContext";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class SweepingFervor extends Card {
  public get Name(): string {
    return "SweepingFervor";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.player.addShield(3);

    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Pyro(), ctx.player);
    }
  }
}
