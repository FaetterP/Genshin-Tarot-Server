import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SteelFang extends Card {
  public get Name(): string {
    return "SteelFang";
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

    // TODO
  }
}
