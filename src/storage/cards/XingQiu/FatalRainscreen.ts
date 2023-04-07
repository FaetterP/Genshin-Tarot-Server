import { CardUseContext } from "../../../../types/functionsContext";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class FatalRainscreen extends Card {
  public get Name(): string {
    return "FatalRainscreen";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.applyElement(new Hydro(), ctx.player);
    ctx.player.addShield(4);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(2);
    }
  }
}
