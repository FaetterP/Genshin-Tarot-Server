import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { SolarIsotomaEffect } from "../../effects/SolarIsotomaEffect";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";

export class SolarIsotomaPlus extends Card {
  public get Name(): ECard {
    return ECard.SolarIsotomaPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    if (ctx.selectedCard === this.ID) throw new Error("card cannot trash itself");

    if (ctx.selectedCard) {
      const inHand = ctx.player.Hand.some((c) => c.ID === ctx.selectedCard);
      const inDiscard = ctx.player.Discard.some((c) => c.ID === ctx.selectedCard);
      if (!inHand && !inDiscard) {
        throw new Error("selectedCard must be a card in your hand or discard");
      }
    }

    const effect = new SolarIsotomaEffect();
    ctx.addToSteps([
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Geo,
        }),
      ),
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }
    ctx.player.addEffect(effect);

    if (ctx.selectedCard) {
      ctx.player.trashCardById(ctx.selectedCard);
      const drawn = ctx.player.drawCard();
      ctx.addToSteps([
        { type: EDetailedStep.DrawCards, playerId: ctx.player.ID, cards: [drawn.getPrimitive()] },
      ]);
    }
  }
}
