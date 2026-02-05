import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class RavagingConfession extends Card {
  public get Name(): string {
    return "RavagingConfession";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    });
    // TODO
  }
}
