import { EPlayerEffect } from "../../types/enums";
import { Attack } from "../../types/general";
import { Player } from "../../game/Player";
import { Hydro } from "../elements/Hydro";
import { PlayerEffect } from "./PlayerEffect";

export class MirrorReflectionsEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.MirrorReflections;
  }

  public override onStartCycle(player: Player): boolean {
    for (const enemy of player.Enemies) {
      const attack: Attack = {
        damage: 2,
        element: new Hydro(),
        player,
      };
      enemy.applyAttack(attack);
    }

    return true;
  }
}
