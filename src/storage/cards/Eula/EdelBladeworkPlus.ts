import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class EdelBladeworkPlus extends Card {
  public get Name(): ECard {
    return ECard.EdelBladeworkPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 2,
        isPiercing: false,
        element: EElement.Cryo,
      },
    ]);
    target.applyAttack({
      damage: 2,
      element: new Cryo(),
      player: ctx.player,
    });

    ctx.player.snowflakes += 1;
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "eulaSnowflakes",
        playerId: ctx.player.ID,
        delta: 1,
      },
    ]);
  }
}
