import { CharacterUseBurstContext } from "../../../types/functionsContext";
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
    ctx.player.drawCard();
    ctx.player.drawCard();
    ctx.player.drawCard();
    // TODO
  }
}
