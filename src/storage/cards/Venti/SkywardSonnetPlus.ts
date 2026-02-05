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
    const player = ctx.selectedPlayer ?? ctx.player;
    const effect = new SkywardSonnetPlusEffect();
    ctx.addToSteps([
      ...player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Anemo",
      })),
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    for (const enemy of player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }
    ctx.player.addEffect(effect);
  }
}
