import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class LightningTouchPlus extends Card {
  public get Name(): ECard {
    return ECard.LightningTouchPlus;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const drawn = ctx.player.drawCard();
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element: EElement.Electro,
      },
      {
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [drawn.getPrimitive()],
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Electro(),
      player: ctx.player,
    });
  }
}
