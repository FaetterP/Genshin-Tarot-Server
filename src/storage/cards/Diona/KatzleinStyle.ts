import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { KatzleinStylePlus } from "./KatzleinStylePlus";

export class KatzleinStyle extends Card {
  public get Name(): string {
    return "KatzleinStyle";
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return KatzleinStylePlus;
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
        damage: 2,
        isPiercing: true,
      },
    ]);
    target.applyAttack({
      damage: 2,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    });
  }
}
