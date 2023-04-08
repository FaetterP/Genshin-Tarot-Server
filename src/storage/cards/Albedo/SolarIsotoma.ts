import { CardUseContext } from "../../../../types/functionsContext";
import { SolarIsotomaEffect } from "../../effects/SolarIsotomaEffect";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class SolarIsotoma extends Card {
  public get Name(): string {
    return "SolarIsotoma";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }

    // TODO discard card

    ctx.player.addEffect(new SolarIsotomaEffect());
  }
}
