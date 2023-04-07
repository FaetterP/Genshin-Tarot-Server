import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class Frostgnaw extends Card {
  public get Name(): string {
    return "Frostgnaw";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }

    ctx.player.addEnergy(1);
  }
}
