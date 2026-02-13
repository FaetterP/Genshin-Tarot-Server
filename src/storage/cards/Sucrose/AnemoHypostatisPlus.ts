import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class AnemoHypostatisPlus extends Card {
  public get Name(): ECard {
    return ECard.AnemoHypostatisPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.ID,
        element: EElement.Anemo,
      })),
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }
    // TODO
  }
}
