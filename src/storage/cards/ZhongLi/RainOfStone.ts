import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class RainOfStone extends Card {
  public get Name(): string {
    return "RainOfStone";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      if (ctx.enemies.length <= 2) {
        throw new Error("need 2 enemies");
      }

      if (ctx.enemies[0] === ctx.enemies[1]) {
        throw new Error("need 2 different enemies");
      }

      const attack: Attack = {
        damage: 1,
        isPiercing: true,
        isRange: true,
        player: ctx.player,
      };
      ctx.enemies[0].applyAttack(attack);
    }
  }
}
