import type { PlayerEndTurnContext, PlayerUseCardContext } from "../../types/eventsContext";
import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";

export abstract class PlayerEffect {
  public abstract get Name(): string;

  public onStartCycle(player: Player): boolean {
    return true;
  }
  public onAttack(player: Player, enemy: Enemy): boolean {
    return false;
  }

  public onUseCard(_ctx: PlayerUseCardContext): void {}

  public onEndTurn(_ctx: PlayerEndTurnContext): boolean {
    return false;
  }

  public getAttackBonus(): { bonusDamage: number; energyOnKill: number } | null {
    return null;
  }
}
