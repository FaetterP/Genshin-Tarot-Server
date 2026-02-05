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
    const effect = new SkywardSonnetEffect();
    ctx.addToSteps([
      ...ctx.player.Enemies.map((enemy) => ({
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
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }
    ctx.player.addEffect(effect);
  }
}
