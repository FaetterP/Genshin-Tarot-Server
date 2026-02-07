import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";
import { getRandomElement } from "../../utils/arrays";
import { getAllPlayers } from "../../ws";

export class LetTheShowBeginPlusEffect extends PlayerEffect {
  public get Name(): string {
    return "LetTheShowBeginPlus";
  }

  public override onStartCycle(_player: Player): boolean {
    return true;
  }

  public override onAttack(player: Player, enemy: Enemy): boolean {
    const allPlayers = getAllPlayers();
    const target = getRandomElement(allPlayers);
    target.addHealth(1);

    player.addSteps([
      { type: "player_heal", playerId: target.ID, amount: 1 },
    ]);

    return false;
  }
}
