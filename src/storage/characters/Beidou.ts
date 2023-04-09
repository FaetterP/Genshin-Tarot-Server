import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Oceanborn } from "../cards/Beidou/Oceanborn";
import { Tidecaller } from "../cards/Beidou/Tidecaller";
import { StormbreakerEffect } from "../effects/StormbreakerEffect";
import { Character } from "./Character";

export class Beidou extends Character {
  public get Name() {
    return "Beidou";
  }

  constructor() {
    const cards = [
      new Oceanborn(),
      new Oceanborn(),
      new Oceanborn(),
      new Tidecaller(),
      new Tidecaller(),
    ];
    super({ cards, burstCost: 4 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    ctx.player.drawCard();
    ctx.player.drawCard();

    ctx.player.addEffect(new StormbreakerEffect());
  }
}
