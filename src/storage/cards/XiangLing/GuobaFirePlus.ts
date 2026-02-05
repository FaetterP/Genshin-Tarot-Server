import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { GuobaFireEffect } from "../../effects/GuobaFireEffect";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class GuobaFirePlus extends Card {
  public get Name(): string {
    return "GuobaFirePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const effect = new GuobaFireEffect();
    ctx.addToSteps([
      ...ctx.player.Enemies.map((enemy) => ({
        type: "enemy_take_damage" as const,
        enemyId: enemy.ID,
        damage: 2,
        isPiercing: false,
        element: "Pyro",
      })),
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyAttack({
        damage: 2,
        element: new Pyro(),
        player: ctx.player,
      });
    }
    ctx.player.addEffect(effect);
  }
}
