import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class SweepingFervorPlus extends Card {
  public get Name(): ECard {
    return ECard.SweepingFervorPlus;
  }

  constructor() {
    super(0, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerChangeShield,
        playerId: ctx.player.ID,
        delta: 3,
      },
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Pyro,
        }),
      ),
    ]);
    ctx.player.addShield(3);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Pyro(), ctx.player);
    }
  }
}
