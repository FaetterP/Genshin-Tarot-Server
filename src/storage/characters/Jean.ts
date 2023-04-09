import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { FavoniusBladework } from "../cards/Jean/FavoniusBladework";
import { GaleBlade } from "../cards/Jean/GaleBlade";
import { Anemo } from "../elements/Anemo";
import { Character } from "./Character";

export class Jean extends Character {
  public get Name() {
    return "Jean";
  }

  constructor() {
    const cards = [
      new FavoniusBladework(),
      new FavoniusBladework(),
      new FavoniusBladework(),
      new GaleBlade(),
      new GaleBlade(),
    ];
    super({ cards, burstCost: 5 });
  }

  useBurst(ctx: CharacterUseBurstContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }

    ctx.player.addHealth(2);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(2);
    }
  }
}
