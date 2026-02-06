import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Card } from "../Card";

export class KatzleinStylePlus extends Card {
  public get Name(): string {
    return "KatzleinStylePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = ctx.player.Shields > 0 ? 5 : 2;
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: true,
      },
    ]);
    target.applyAttack({
      damage,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    });
  }
}
