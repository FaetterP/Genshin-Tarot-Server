import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { ForeignRockblade } from "../cards/Aether/ForeignRockblade";
import { StarfellSword } from "../cards/Aether/StarfellSword";
import { Character } from "./Character";

export class Aether extends Character {
  constructor() {
    const cards = [
      new ForeignRockblade(),
      new ForeignRockblade(),
      new ForeignRockblade(),
      new StarfellSword(),
      new StarfellSword(),
    ];
    super({cards, burstCost:4});
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    const otherPlayers = ctx.allPlayers.filter(
      (player) => player !== ctx.player
    );

    for (const player of otherPlayers) {
      player.addShield(3);
    }
  }
}
