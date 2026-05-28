import { EEnemyEffect, EDetailedStep } from "../../types/enums";
import { EnemyEffect } from "./EnemyEffect";
import type { EnemyTakeDamageContext } from "../../types/eventsContext";

export class HeraldOfFrostEffect extends EnemyEffect {
  public get Name(): EEnemyEffect {
    return EEnemyEffect.HeraldOfFrost;
  }

  public onTakeDamage(ctx: EnemyTakeDamageContext): boolean {
    ctx.player.addSteps([{ type: EDetailedStep.PlayerHeal, playerId: ctx.player.ID, amount: 2 }]);
    ctx.player.addHealth(2);
    return true;
  }
}
