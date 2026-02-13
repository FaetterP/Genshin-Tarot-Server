import { CharacterUseBurstContext } from "../../types/functionsContext";
import { Oceanborn } from "../cards/Beidou/Oceanborn";
import { Tidecaller } from "../cards/Beidou/Tidecaller";
import { StormbreakerEffect } from "../effects/StormbreakerEffect";
import { ECharacter, EDetailedStep } from "../../types/enums";
import { Character } from "./Character";

export class Beidou extends Character {
  public get Name() {
    return ECharacter.Beidou;
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
        type: EDetailedStep.DrawCards,
        playerId: ctx.player.ID,
        cards: [card1.getPrimitive(), card2.getPrimitive()],
      },
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: new StormbreakerEffect().Name,
      },
    ]);
  }
}
