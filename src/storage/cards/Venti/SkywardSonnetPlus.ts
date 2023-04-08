import { CardUseContext } from "../../../../types/functionsContext";
import { SkywardSonnetPlusEffect } from "../../effects/SkywardSonnetPlusEffect";
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

    ctx.player.addEffect(new SkywardSonnetPlusEffect());
  }
}
