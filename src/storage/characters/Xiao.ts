import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { WhirlwindThrust } from "../cards/Xiao/WhirlwindThrust";
import { LemniscaticWind } from "../cards/Xiao/LemniscaticWind";
import { Character } from "./Character";

export class Xiao extends Character {
  public get Name() {
    return "Xiao";
  }

  constructor() {
    const cards = [
      new WhirlwindThrust(),
      new WhirlwindThrust(),
      new WhirlwindThrust(),
      new LemniscaticWind(),
      new LemniscaticWind(),
    ];
    super({ cards, burstCost: 2 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    ctx.player.applyDamage(1); // TODO piercing
    // TODO add dash to hand

    ctx.addToSteps([
      {
        type: "player_take_damage",
        playerId: ctx.player.ID,
        damage: 1,
        isPiercing: true,
      },
    ]);
  }
}
