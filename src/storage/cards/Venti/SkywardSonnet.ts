import { CardUseContext } from "../../../../types/functionsContext";
import { SkywardSonnetEffect } from "../../effects/SkywardSonnetEffect";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class SkywardSonnet extends Card {
  public get Name(): string {
    return "SkywardSonnet";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }

    ctx.player.addEffect(new SkywardSonnetEffect());
  }
}
