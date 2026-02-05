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

  /**
   * Если эффект даёт бонус к следующей атаке — вернуть его; эффект будет потрачен при атаке.
   * Несколько эффектов (например, две Перегрузки) суммируются: +2 урона, +4 энергии при убийстве.
   */
  public getAttackBonus(): { bonusDamage: number; energyOnKill: number } | null {
    return null;
  }
}
