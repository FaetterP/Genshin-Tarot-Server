import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Card } from "../Card";

export class OceanbornPlus extends Card {
  public get Name(): string {
    return "OceanbornPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const damage = ctx.player.IsTookDamageLastTurn ? 4 : 2;
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_take_damage" as const,
        enemyId: enemy.ID,
        damage,
        isPiercing: false,
      }))
    );
    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage,
        player: ctx.player,
      };
      enemy.applyAttack(attack);
    }
  }
}
