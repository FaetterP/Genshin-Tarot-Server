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
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_take_damage" as const,
        enemyId: enemy.ID,
        damage: 2,
        isPiercing: false,
      }))
    );
    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 2,
        player: ctx.player,
      };
      // TODO 4 damage
      enemy.applyAttack(attack);
    }
  }
}
