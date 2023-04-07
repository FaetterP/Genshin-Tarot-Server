import { CardUseContext } from "../../../../types/functionsContext";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class DominusLapidis extends Card {
  public get Name(): string {
    return "DominusLapidis";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    ctx.player.addShield(3);
    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addShield(3);
    }

    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }
  }
}
