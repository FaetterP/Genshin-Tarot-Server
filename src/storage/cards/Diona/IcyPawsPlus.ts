import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class IcyPawsPlus extends Card {
  public get Name(): ECard {
    return ECard.IcyPawsPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: ctx.player.ID,
        delta: 3,
      },
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Cryo,
        }),
      ),
    ]);
    ctx.player.addShield(3);

    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }

    const burnInDiscard = ctx.player.Discard.find((c) => c.Name === ECard.Burn);
    if (burnInDiscard) {
      ctx.player.trashCardById(burnInDiscard.ID);
    }
  }
}
