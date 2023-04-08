import { Player } from "../../game/Player";
import { Geo } from "../elements/Geo";
import { PlayerEffect } from "./PlayerEffect";

export class DominusLapidisEffect extends PlayerEffect {
  public get Name(): string {
    return "DominusLapidis";
  }

  public override onStartCycle(player: Player): boolean {
    for (const enemy of player.Enemies) {
      enemy.applyElement(new Geo(), player);
    }
    return true;
  }
}
