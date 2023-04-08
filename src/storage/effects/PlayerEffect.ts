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
}
