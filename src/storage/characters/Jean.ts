import { CharacterUseBurstContext } from "../../types/functionsContext";
import { FavoniusBladework } from "../cards/Jean/FavoniusBladework";
import { GaleBlade } from "../cards/Jean/GaleBlade";
import { Anemo } from "../elements/Anemo";
import { ECharacter, EDetailedStep } from "../../types/enums";
import { Character } from "./Character";

export class Jean extends Character {
  public get Name() {
    return ECharacter.Jean;
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
    const anemo = new Anemo();
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(anemo, ctx.player);
      ctx.addToSteps([{ type: EDetailedStep.EnemyGetElement, enemyId: enemy.ID, element: anemo.Name }]);
    }

    ctx.player.addHealth(2);
    ctx.addToSteps([{ type: EDetailedStep.PlayerHeal, playerId: ctx.player.ID, amount: 2 }]);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(2);
      ctx.addToSteps([{ type: EDetailedStep.PlayerHeal, playerId: ctx.selectedPlayer.ID, amount: 2 }]);
    }
  }
}
