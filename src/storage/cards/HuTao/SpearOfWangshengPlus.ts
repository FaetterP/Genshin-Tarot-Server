import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SpearOfWangsheng extends Card {
  public get Name(): string {
    return "SpearOfWangsheng";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: "player_take_damage",
        playerId: ctx.player.ID,
        damage: 1,
        isPiercing: false,
      },
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: ctx.player.Health <= 7 ? 4 : 1,
        isPiercing: true,
      },
    ]);
    ctx.player.applyDamage(1);
    target.applyAttack({
      damage: ctx.player.Health <= 7 ? 4 : 1,
      isPiercing: true,
      player: ctx.player,
    });
    // TODO
  }
}
