import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { removeDuplicates } from "../../../utils/arrays";
import { Geo } from "../../elements/Geo";
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

    const enemies = removeDuplicates(ctx.enemies);
    if (enemies.length <= 2) {
      throw new Error("need 2 enemies");
    }

    for (let i = 0; i < 2; i++) {
      const attack: Attack = {
        damage: 2,
        isPiercing: true,
        isRange: true,
        element: new Geo(),
        player: ctx.player,
      };
      enemies[i].applyAttack(attack);
    }
  }
}
