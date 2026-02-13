import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Demonbane } from "../cards/ChongYun/Demonbane";
import { LayeredFrost } from "../cards/ChongYun/LayeredFrost";
import { ECharacter, EDetailedStep } from "../../types/enums";
import { Character } from "./Character";

export class ChongYun extends Character {
  public get Name() {
    return ECharacter.ChongYun;
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
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [card1.getPrimitive(), card2.getPrimitive(), card3.getPrimitive()],
      },
    ]);
  }
}
