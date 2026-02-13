import { CharacterUseBurstContext } from "../../types/functionsContext";
import { EdelBladework } from "../cards/Eula/EdelBladework";
import { IcetideVortex } from "../cards/Eula/IcetideVortex";
import { Character } from "./Character";
import { GlacialIlluminationEffect } from "../effects/GlacialIlluminationEffect";

export class Eula extends Character {
  public get Name() {
    return "Eula";
  }

  constructor() {
    const cards = [
      new EdelBladework(),
      new EdelBladework(),
      new EdelBladework(),
      new IcetideVortex(),
      new IcetideVortex(),
    ];
    super({ cards, burstCost: 4 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    ctx.player.snowflakes = 0;
    const effect = new GlacialIlluminationEffect();
    ctx.player.addEffect(effect);
    ctx.addToSteps([{ type: "player_get_effect", playerId: ctx.player.ID, effect: effect.Name }]);
  }
}
