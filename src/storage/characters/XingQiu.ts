import { CharacterUseBurstContext } from "../../types/functionsContext";
import { GuhuaStyle } from "../cards/XingQiu/GuhuaStyle";
import { FatalRainscreen } from "../cards/XingQiu/FatalRainscreen";
import { Character } from "./Character";
import { RaincutterEffect } from "../effects/RaincutterEffect";

export class XingQiu extends Character {
  public get Name() {
    return "XingQiu";
  }

  constructor() {
    const cards = [
      new GuhuaStyle(),
      new GuhuaStyle(),
      new GuhuaStyle(),
      new FatalRainscreen(),
      new FatalRainscreen(),
    ];
    super({ cards, burstCost: 4 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    const card1 = ctx.player.drawCard();
    const card2 = ctx.player.drawCard();

    ctx.player.addEffect(new RaincutterEffect());

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
        effect: new RaincutterEffect().Name,
      },
    ]);
  }
}
