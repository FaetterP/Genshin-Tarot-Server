import { CardUseContext } from "../../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class SkywardSonnetPlus extends Card {
  public get Name(): string {
    return "SkywardSonnetPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    let player = ctx.player;
    if (ctx.selectedPlayer) {
      player = ctx.selectedPlayer;
    }

    for (const enemy of player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }

    // TODO next attack +2 damage
  }
}
