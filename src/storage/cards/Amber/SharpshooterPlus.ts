import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SharpshooterPlus extends Card {
  public get Name(): string {
    return "SharpshooterPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = target.Shield === 0 ? 3 : 1;

    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: true,
      },
    ]);

    const attack: Attack = {
      damage,
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };
    target.applyAttack(attack);
  }
}
