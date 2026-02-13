import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";
import { SparklingScatterPlus } from "./SparklingScatterPlus";

export class SparklingScatter extends Card {
  public get Name(): ECard {
    return ECard.SparklingScatter;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return SparklingScatterPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const drawn = ctx.player.drawCard();
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element: EElement.Geo,
      },
      {
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [drawn.getPrimitive()],
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Geo(),
      player: ctx.player,
    });
  }
}
