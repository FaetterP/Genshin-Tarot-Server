import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";
import { Attack } from "../../../../types/general";

export class StarfellSword extends Card {
  public get Name(): string {
    return "StarfellSword";
  }

  constructor() {
    super(2);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 2,
        isPiercing: true,
        player: ctx.player,
      };

      enemy.applyAttack(attack);
    }
  }
}
