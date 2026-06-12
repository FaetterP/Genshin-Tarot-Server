import { CardUseContext } from "../../../types/functionsContext";
import { Player } from "../../../game/Player";
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

  async use(ctx: CardUseContext): Promise<void> {
    for (const enemy of ctx.player.Enemies) {
      ctx.addToSteps([{
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.ID,
        element: EElement.Anemo,
      }]);

      let healTarget: Player | undefined;
      if (enemy.Elements.length > 0) {
        const response = await ctx.sendAndWait<{ isHeal: boolean; targetPlayerId?: string }>({
          action: "game.anemoReaction",
          enemyId: enemy.ID,
        });
        if (response.isHeal && response.targetPlayerId) {
          healTarget = ctx.players.find((p) => p.ID === response.targetPlayerId);
        }
      }

      enemy.applyElement(new Anemo(), ctx.player, healTarget ? { healTarget } : undefined);
    }
  }
}
