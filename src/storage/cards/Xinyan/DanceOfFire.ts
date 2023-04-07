import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class DanceOfFire extends Card {
  public get Name(): string {
    return "DanceOfFire";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (ctx.enemy.Shield > 0) {
      ctx.enemy.addShields(-1);
    } else {
      const attack: Attack = { damage: 2, player: ctx.player };
      ctx.enemy.applyAttack(attack);
    }

    if (ctx.isUseAlternative && ctx.player.trySpendActonPoints(1)) {
      if (ctx.enemy.Shield > 0) {
        ctx.enemy.addShields(-1);
      } else {
        const attack: Attack = { damage: 2, player: ctx.player };
        ctx.enemy.applyAttack(attack);
      }
    }
  }
}
