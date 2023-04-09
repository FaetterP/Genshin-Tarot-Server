import { CharacterUseBurstContext } from "../../../types/functionsContext";
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
    ctx.player.drawCard();
    ctx.player.drawCard();

    ctx.player.addEffect(new RaincutterEffect());
  }
}
