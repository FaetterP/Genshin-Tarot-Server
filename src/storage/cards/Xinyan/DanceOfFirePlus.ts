import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class DanceOfFirePlus extends Card {
  public get Name(): string {
    return "DanceOfFirePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const damage = ctx.player.Shields > 0 ? 3 : 1;
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_take_damage" as const,
        enemyId: enemy.ID,
        damage,
        isPiercing: false,
      }))
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyAttack({
        damage,
        player: ctx.player,
      });
    }
  }
}
