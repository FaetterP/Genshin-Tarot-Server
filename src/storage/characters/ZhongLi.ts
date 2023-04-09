import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { RainOfStone } from "../cards/ZhongLi/RainOfStone";
import { DominusLapidis } from "../cards/ZhongLi/DominusLapidis";
import { Character } from "./Character";
import { Attack } from "../../../types/general";

export class ZhongLi extends Character {
  public get Name() {
    return "ZhongLi";
  }

  constructor() {
    const cards = [
      new RainOfStone(),
      new RainOfStone(),
      new RainOfStone(),
      new DominusLapidis(),
      new DominusLapidis(),
    ];
    super({ cards, burstCost: 10 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    if (ctx.selectedPlayer) {
      for (const enemy of ctx.selectedPlayer.Enemies) {
        const attack: Attack = {
          damage: 3,
          isPiercing: true,
          isRange: true,
          player: ctx.player,
        };
        enemy.applyAttack(attack);
      }
    }

    for (const player of ctx.allPlayers) {
      for (const enemy of player.Enemies) {
        enemy.addStun();
      }
    }
  }
}
