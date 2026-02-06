import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Demonbane } from "../cards/ChongYun/Demonbane";
import { LayeredFrost } from "../cards/ChongYun/LayeredFrost";
import { Character } from "./Character";

export class ChongYun extends Character {
  public get Name() {
    return "ChongYun";
  }

  constructor() {
    const cards = [
      new Demonbane(),
      new Demonbane(),
      new Demonbane(),
      new LayeredFrost(),
      new LayeredFrost(),
    ];
    super({ cards, burstCost: 3 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    const card1 = ctx.player.drawCard();
    const card2 = ctx.player.drawCard();
    const card3 = ctx.player.drawCard();
    // TODO

    ctx.addToSteps([
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [
          { cardId: card1.ID, name: card1.Name },
          { cardId: card2.ID, name: card2.Name },
          { cardId: card3.ID, name: card3.Name },
        ],
      },
    ]);
  }
}
