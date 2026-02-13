import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Card } from "../cards/Card";
import { Electro } from "../elements/Electro";
import { ECharacter, EDetailedStep } from "../../types/enums";
import { Character } from "./Character";
import { LightningTouch } from "../cards/Lisa/LightningTouch";
import { VioletArc } from "../cards/Lisa/VioletArc";

export class Lisa extends Character {
  public get Name() {
    return ECharacter.Lisa;
  }

  constructor() {
    const cards: Card[] = [
      new LightningTouch(),
      new LightningTouch(),
      new LightningTouch(),
      new VioletArc(),
      new VioletArc(),
    ];
    super({ cards, burstCost: 3 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    const card1 = ctx.player.drawCard();
    const card2 = ctx.player.drawCard();

    if (ctx.selectedEnemy) {
      const electro = new Electro();
      ctx.selectedEnemy.applyElement(electro, ctx.player);
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemyGetElement,
          enemyId: ctx.selectedEnemy.ID,
          element: electro.Name,
        },
      ]);
    }

    ctx.addToSteps([
      {
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [card1.getPrimitive(), card2.getPrimitive()],
      },
    ]);
  }
}
