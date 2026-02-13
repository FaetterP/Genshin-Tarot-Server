import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { SweepingFervorPlus } from "./SweepingFervorPlus";

export class SweepingFervor extends Card {
  public get Name(): ECard {
    return ECard.SweepingFervor;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return SweepingFervorPlus;
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
