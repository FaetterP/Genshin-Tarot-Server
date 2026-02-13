import type { PlayerEndTurnContext, PlayerUseCardContext } from "../../types/eventsContext";
import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

const EULA_CARD_NAMES = [
  "EdelBladework",
  "EdelBladeworkPlus",
  "IcetideVortex",
  "IcetideVortexPlus",
] as const;

export class GlacialIlluminationEffect extends PlayerEffect {
  public get Name(): string {
    return "GlacialIllumination";
  }

  public override onStartCycle(_player: Player): boolean {
    return false;
  }

  public override onAttack(_player: Player, _enemy: Enemy): boolean {
    return false;
  }

  public override onUseCard(ctx: PlayerUseCardContext): void {
    if (EULA_CARD_NAMES.includes(ctx.usedCard.Name as (typeof EULA_CARD_NAMES)[number])) {
      ctx.player.snowflakes += 1;
    }
  }

  public override onEndTurn(ctx: PlayerEndTurnContext): boolean {
    const enemies = ctx.eulaSelectedEnemies ?? [];
    const n = ctx.player.snowflakes;
    if (n > 0 && enemies.length > n) {
      throw new Error(`too many targets, need: ${n}, got: ${enemies.length}`);
    }
    for (const enemy of enemies) {
      ctx.addToSteps([
        { type: "enemy_take_damage", enemyId: enemy.ID, damage: 2, isPiercing: false },
      ]);
      enemy.applyAttack({ damage: 2, player: ctx.player, isRange: true });
    }
    ctx.player.snowflakes = 0;
    ctx.addToSteps([{ type: "player_lose_effect", playerId: ctx.player.ID, effect: this.Name }]);
    return true;
  }
}
