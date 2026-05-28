import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { removeDuplicates } from "../../../utils/arrays";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class SparklingScatterPlus extends Card {
  public get Name(): ECard {
    return ECard.SparklingScatterPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const enemies = removeDuplicates(ctx.enemies);
    if (enemies.length > 2) {
      throw new Error("too many enemies");
    }

    ctx.addToSteps(
      enemies.map((enemy) => ({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.ID,
        damage: 2,
        isPiercing: true,
        element: EElement.Geo,
      })),
    );
    for (const enemy of enemies) {
      enemy.applyAttack({
        damage: 2,
        isPiercing: true,
        isRange: true,
        player: ctx.player,
      });
      enemy.applyElement(new Geo(), ctx.player);
    }
  }
}
