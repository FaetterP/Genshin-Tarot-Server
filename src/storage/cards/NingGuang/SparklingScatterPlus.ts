import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Card } from "../Card";

export class SparklingScatterPlus extends Card {
  public get Name(): string {
    return "SparklingScatterPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };
    ctx.enemy.applyAttack(attack);

    // TODO attack two enemies
  }
}
