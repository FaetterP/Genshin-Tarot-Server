import { CharacterUseBurstContext } from "../../types/functionsContext";
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
    const card1 = ctx.player.drawCard();
    const card2 = ctx.player.drawCard();

    ctx.player.addEffect(new StormbreakerEffect());

    ctx.addToSteps([
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [
          card1.getPrimitive(),
          card2.getPrimitive(),
        ],
      },
      {
        type: "player_get_effect",
        playerId: ctx.player.ID,
        effect: new StormbreakerEffect().Name,
      },
    ]);
  }
}
