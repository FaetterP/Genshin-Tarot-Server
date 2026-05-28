import { EEnemyEffect, EDetailedStep } from "../../types/enums";
import { EnemyEffect } from "./EnemyEffect";
import type { EnemyTakeDamageContext } from "../../types/eventsContext";

export class HeraldOfFrostPlusEffect extends EnemyEffect {
  public get Name(): EEnemyEffect {
    return EEnemyEffect.HeraldOfFrostPlus;
  }

  public onTakeDamage(ctx: EnemyTakeDamageContext): boolean {
    ctx.player.addSteps([
      { type: EDetailedStep.PlayerHeal, playerId: ctx.player.ID, amount: 3 },
      { type: EDetailedStep.PlayerStatChange, stat: "energy", playerId: ctx.player.ID, delta: 2 },
    ]);
    ctx.player.addHealth(3);
    ctx.player.addEnergy(2);
    return true;
  }
}
