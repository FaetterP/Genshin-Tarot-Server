import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class Oceanborn extends Card {
  public get Name(): string {
    return "Oceanborn";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    if (ctx.enemies[0].Shield > 0) {
      ctx.enemies[0].addShields(-1);
    } else {
      const attack: Attack = {
        damage: 2,
        player: ctx.player,
      };
      ctx.enemies[0].applyAttack(attack);
    }

    if (ctx.isUseAlternative && ctx.player.trySpendActonPoints(1)) {
      if (ctx.enemies[0].Shield > 0) {
        ctx.enemies[0].addShields(-1);
      } else {
        const attack: Attack = {
          damage: 2,
          player: ctx.player,
        };
        ctx.enemies[0].applyAttack(attack);
      }
    }
  }
}
