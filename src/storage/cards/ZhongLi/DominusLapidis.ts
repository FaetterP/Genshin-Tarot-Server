import { CardUseContext } from "../../../../types/functionsContext";
import { DominusLapidisEffect } from "../../effects/DominusLapidisEffect";
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
    const effect = new DominusLapidisEffect();
    ctx.addToSteps([
      {
        type: "player_change_shield",
        playerId: ctx.player.ID,
        delta: 3,
      },
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
    if (ctx.selectedPlayer) {
      ctx.addToSteps([{
        type: "player_change_shield",
        playerId: ctx.selectedPlayer.ID,
        delta: 3,
      }]);
    }
    ctx.player.addShield(3);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addShield(3);
    }

    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }

    ctx.player.addEffect(effect);
  }
}
