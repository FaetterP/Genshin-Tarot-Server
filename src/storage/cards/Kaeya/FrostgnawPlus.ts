import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class FrostgnawPlus extends Card {
  public get Name(): ECard {
    return ECard.FrostgnawPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Cryo,
        }),
      ),
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }
    ctx.player.addEnergy(2);
    ctx.player.addHealth(2);
  }
}
