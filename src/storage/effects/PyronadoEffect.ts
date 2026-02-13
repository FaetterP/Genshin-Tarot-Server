import { EPlayerEffect } from "../../types/enums";
import { Player } from "../../game/Player";
import { Pyro } from "../elements/Pyro";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class PyronadoEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.Pyronado;
  }

  public override onAttack(player: Player, enemy: Enemy): boolean {
    enemy.applyElement(new Pyro(), player);
    return false;
  }
}
