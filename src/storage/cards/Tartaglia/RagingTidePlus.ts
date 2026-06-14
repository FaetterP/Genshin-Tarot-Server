import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class RagingTidePlus extends Card {
  public get Name(): ECard {
    return ECard.RagingTidePlus;
  }

  constructor() {
    super(0, ECardType.Skill);
  }

  async use(ctx: CardUseContext): Promise<void> {
    const c1 = ctx.player.drawCard();
    const c2 = ctx.player.drawCard();
    const c3 = ctx.player.drawCard();
    ctx.addToSteps([
      {
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [c1.getPrimitive(), c2.getPrimitive(), c3.getPrimitive()],
      },
    ]);

    const { selectedCards, enemies: enemyIds } = await ctx.sendAndWait<{
      selectedCards: string[];
      enemies: string[];
    }>({
      action: "game.ragingTideSelect",
    });

    const count = Math.min(selectedCards.length, enemyIds.length, 3);
    for (let i = 0; i < count; i++) {
      const card = ctx.player.Hand.find((c) => c.ID === selectedCards[i]);
      if (!card) continue;

      const enemy = ctx.player.Enemies.find((e) => e.ID === enemyIds[i]);
      if (!enemy) continue;

      ctx.addToSteps([{
        type: EDetailedStep.MoveCard,
        to: "discard",
        playerId: ctx.player.ID,
        card: card.getPrimitive(),
      }]);
      ctx.player.discardCard(card);

      ctx.addToSteps([{
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.ID,
        element: EElement.Hydro,
      }]);
      const energyBefore = ctx.player.Energy;
      enemy.applyElement(new Hydro(), ctx.player);
      const energyDelta = ctx.player.Energy - energyBefore;
      if (energyDelta !== 0) {
        ctx.addToSteps([{
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: energyDelta,
        }]);
      }
    }
  }
}
