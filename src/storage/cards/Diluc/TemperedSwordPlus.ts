import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class TemperedSwordPlus extends Card {
  public get Name(): string {
    return "TemperedSwordPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    if (ctx.enemies[0].Shield > 0) {
      ctx.enemies[0].addShields(-Infinity);
    } else {
      const attack: Attack = {
        damage: 4,
        player: ctx.player,
      };
      ctx.enemies[0].applyAttack(attack);
    }
  }
}
