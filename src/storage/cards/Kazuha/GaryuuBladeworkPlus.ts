import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class GaryuuBladeworkPlus extends Card {
  public get Name(): string {
    return "GaryuuBladeworkPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = { damage: 3, player: ctx.player };
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
