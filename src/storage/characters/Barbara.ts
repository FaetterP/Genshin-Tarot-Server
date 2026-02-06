import { CharacterUseBurstContext } from "../../types/functionsContext";
import { WhisperOfWater } from "../cards/Barbara/WhisperOfWater";
import { LetTheShowBegin } from "../cards/Barbara/LetTheShowBegin";
import { Character } from "./Character";

export class Barbara extends Character {
  public get Name() {
    return "Barbara";
  }

  constructor() {
    const cards = [
      new WhisperOfWater(),
      new WhisperOfWater(),
      new WhisperOfWater(),
      new LetTheShowBegin(),
      new LetTheShowBegin(),
    ];
    super({ cards, burstCost: 5 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (!ctx.divide) {
      throw new Error("need divide");
    }

    const sumHealth = ctx.divide
      .map((item) => item.count)
      .reduce((a, b) => a + b);
    if (sumHealth > 5) {
      throw new Error("sumHealth need less then 5");
    }

    for (const { player, count } of ctx.divide) {
      player.addHealth(count);
      ctx.addToSteps([
        { type: "player_heal", playerId: player.ID, amount: count },
      ]);
    }
  }
}
