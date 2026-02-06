import { Attack } from "../../types/general";
import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class SkywardSonnetEffect extends PlayerEffect {
  public get Name(): string {
    return "SkywardSonnet";
  }

  public override onStartCycle(player: Player): boolean {
    return false;
  }

  // TODO
  public override onAttack(player: Player, enemy: Enemy): boolean {
    const attack: Attack = { damage: 1, player: player };
    enemy.applyAttack(attack);

    return true;
  }
}
