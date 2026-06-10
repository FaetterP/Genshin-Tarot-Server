import { CardUseContext } from "../../../types/functionsContext";
import { ECard, ECardType, EDetailedStep, EElement } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class BalefulOmenPlus extends Card {
  public get Name(): ECard {
    return ECard.BalefulOmenPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of [...ctx.player.Enemies]) {
      if (enemy.Health <= 0) continue;
      ctx.addToSteps([{ type: EDetailedStep.EnemyGetElement, enemyId: enemy.ID, element: EElement.Electro }]);
      enemy.applyElement(new Electro(), ctx.player);
    }

    const selfDelta = Math.min(2, 5 - ctx.player.raidenPoints);
    if (selfDelta > 0) {
      ctx.player.raidenPoints += selfDelta;
      ctx.addToSteps([{
        type: EDetailedStep.PlayerStatChange,
        stat: "raidenPoints",
        playerId: ctx.player.ID,
        delta: selfDelta,
      }]);
    }

    if (ctx.selectedPlayer) {
      const delta = Math.min(1, 5 - ctx.selectedPlayer.raidenPoints);
      if (delta > 0) {
        ctx.selectedPlayer.raidenPoints += delta;
        ctx.addToSteps([{
          type: EDetailedStep.PlayerStatChange,
          stat: "raidenPoints",
          playerId: ctx.selectedPlayer.ID,
          delta,
        }]);
      }
    }
  }
}
