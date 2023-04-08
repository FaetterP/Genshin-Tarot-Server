import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class LetTheShowBegin extends PlayerEffect {
  public get Name(): string {
    return "LetTheShowBegin";
  }

  public override onAttack(player: Player, enemy: Enemy): boolean {
    player.addHealth(1);
    return false;
  }
}
