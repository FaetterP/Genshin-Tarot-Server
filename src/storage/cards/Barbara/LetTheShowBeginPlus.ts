import { CardUseContext } from "../../../types/functionsContext";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { LetTheShowBeginPlusEffect } from "../../effects/LetTheShowBeginPlusEffect";

export class LetTheShowBeginPlus extends Card {
  public get Name(): string {
    return "LetTheShowBeginPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Hydro",
      }))
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Hydro(), ctx.player);
    }

    const effect = new LetTheShowBeginPlusEffect();
    ctx.addToSteps([
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.player.addEffect(effect);
  }
}
