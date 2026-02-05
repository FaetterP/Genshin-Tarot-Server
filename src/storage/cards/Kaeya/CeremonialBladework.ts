import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class CeremonialBladework extends Card {
  public get Name(): string {
    return "CeremonialBladework";
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
        damage: 3,
        isPiercing: false,
      },
    ]);
    target.applyAttack({ damage: 3, player: ctx.player });
  }
}
