import { CardUseContext } from "../../../../types/functionsContext";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { FatalRainscreenPlus } from "./FatalRainscreenPlus";

export class FatalRainscreen extends Card {
  public get Name(): string {
    return "FatalRainscreen";
  }

  constructor() {
    super(2);
  }

  get Upgrade() {
    return FatalRainscreenPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: "enemy_get_element", enemyId: target.ID, element: "Hydro" },
      {
        type: "player_change_shield",
        playerId: ctx.player.ID,
        delta: 4,
      },
    ]);
    target.applyElement(new Hydro(), ctx.player);
    ctx.player.addShield(4);
    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(2);
    }
  }
}
