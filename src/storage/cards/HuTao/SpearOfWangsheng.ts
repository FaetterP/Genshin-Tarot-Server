import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Card } from "../Card";
import { SpearOfWangsheng as SpearOfWangshengPlus } from "./SpearOfWangshengPlus";

export class SpearOfWangsheng extends Card {
  public get Name(): string {
    return "SpearOfWangsheng";
  }

  constructor() {
    super(0);
  }

  get Upgrade() {
    return SpearOfWangshengPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = ctx.player.Health <= 7 ? 2 : 1;
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
      player: ctx.player,
    });
  }
}
