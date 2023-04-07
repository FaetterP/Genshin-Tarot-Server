import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class DanceOfFirePlus extends Card {
  public get Name(): string {
    return "DanceOfFirePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = { damage: 1, player: ctx.player };
      if (ctx.player.Shields > 0) {
        attack.damage = 3;
      }
      enemy.applyAttack(attack);
    }
  }
}
