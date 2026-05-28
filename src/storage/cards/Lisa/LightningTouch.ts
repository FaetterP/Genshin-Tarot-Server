import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { LightningTouchPlus } from "./LightningTouchPlus";

export class LightningTouch extends Card {
  public get Name(): ECard {
    return ECard.LightningTouch;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return LightningTouchPlus;
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
      {
        type: EDetailedStep.EnemyGetElement,
        enemyId: target.ID,
        element: EElement.Electro,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    });
    target.applyElement(new Electro(), ctx.player);
  }
}
