import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SparklingScatter extends Card {
  public get Name(): string {
    return "SparklingScatter";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    ctx.player.drawCard();
  }
}
