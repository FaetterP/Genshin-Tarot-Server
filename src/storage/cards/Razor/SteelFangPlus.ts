import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SteelFangPlus extends Card {
  public get Name(): string {
    return "SteelFangPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.enemy.addShields(-1);

    const attack: Attack = { damage: 2, player: ctx.player };
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
