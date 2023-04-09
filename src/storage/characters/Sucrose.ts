import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { WindSpiritCreation } from "../cards/Sucrose/WindSpiritCreation";
import { AnemoHypostatis } from "../cards/Sucrose/AnemoHypostatis";
import { Character } from "./Character";

export class Kaeya extends Character {
  public get Name() {
    return "Kaeya";
  }

  constructor() {
    const cards = [
      new WindSpiritCreation(),
      new WindSpiritCreation(),
      new WindSpiritCreation(),
      new AnemoHypostatis(),
      new AnemoHypostatis(),
    ];
    super({ cards, burstCost: 4 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();
    // TODO
  }
}
