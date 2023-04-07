import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class OceanbornPlus extends Card {
  public get Name(): string {
    return "OceanbornPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 2,
        player: ctx.player,
      };
      // TODO 4 damage
      enemy.applyAttack(attack);
    }
  }
}
