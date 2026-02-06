import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { removeDuplicates } from "../../../utils/arrays";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class WindSpiritCreationPlus extends Card {
  public get Name(): string {
    return "WindSpiritCreationPlus";
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
      throw new Error("need 2 different enemies");
    }

    ctx.addToSteps(
      [0, 1].map((i) => ({
        type: "enemy_take_damage" as const,
        enemyId: enemies[i].ID,
        damage: 2,
        isPiercing: true,
        element: "Anemo",
      }))
    );
    for (let i = 0; i < 2; i++) {
      enemies[i].applyAttack({
        damage: 2,
        isPiercing: true,
        isRange: true,
        element: new Anemo(),
        player: ctx.player,
      });
    }
  }
}
