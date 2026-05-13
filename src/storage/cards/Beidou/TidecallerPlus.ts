import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { Overheat } from "../misc/Overheat";

export class TidecallerPlus extends Card {
  public get Name(): ECard {
    return ECard.TidecallerPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    const overheatCard = new Overheat();
    ctx.addToSteps([
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Electro,
        }),
      ),
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: ctx.player.ID,
        delta: 3,
      },
      {
        type: EDetailedStep.MoveCard,
        playerId: ctx.player.ID,
        card: overheatCard.getPrimitive(),
        to: "hand",
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Electro(), ctx.player);
    }
    ctx.player.addShield(3);
    ctx.player.addCardToHand(overheatCard);
  }
}
