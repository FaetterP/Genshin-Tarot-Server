import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Card } from "../Card";
import { ForeignIronwindPlus } from "./ForeignIronwindPlus";

export class ForeignIronwind extends Card {
  public get Name(): string {
    return "ForeignIronwind";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return ForeignIronwindPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 3;

    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: false,
      },
    ]);

    const attack: Attack = { damage, player: ctx.player };
    target.applyAttack(attack);
  }
}
