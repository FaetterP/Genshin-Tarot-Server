import { CharacterUseBurstContext } from "../../types/functionsContext";
import { WhirlwindThrust } from "../cards/Xiao/WhirlwindThrust";
import { LemniscaticWind } from "../cards/Xiao/LemniscaticWind";
import { ECharacter, EDetailedStep } from "../../types/enums";
import { Character } from "./Character";

export class Xiao extends Character {
  public get Name() {
    return ECharacter.Xiao;
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
        type: EDetailedStep.PlayerTakeDamage,
        playerId: ctx.player.ID,
        damage: 1,
        isPiercing: true,
      },
    ]);
  }
}
