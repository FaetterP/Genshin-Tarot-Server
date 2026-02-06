import { CardUseContext } from "../../../types/functionsContext";
import { SolarIsotomaEffect } from "../../effects/SolarIsotomaEffect";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class SolarIsotomaPlus extends Card {
  public get Name(): string {
    return "SolarIsotomaPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const effect = new SolarIsotomaEffect();
    ctx.addToSteps([
      ...ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Geo",
      })),
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }
    // TODO discard card
    ctx.player.addEffect(effect);
  }
}
