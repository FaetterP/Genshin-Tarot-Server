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
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    // TODO attack two enemies
  }
}
