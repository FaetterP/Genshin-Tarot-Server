import { EDetailedStep, EPlayerEffect } from "../../types/enums";
import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";
import { getRandomElement } from "../../utils/arrays";
import { getAllPlayers } from "../../ws";

export class LetTheShowBeginPlusEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.LetTheShowBeginPlus;
  }

  public override onStartCycle(_player: Player): boolean {
    return true;
  }

  public override onAttack(player: Player, enemy: Enemy): boolean {
    const allPlayers = getAllPlayers();
    const target = getRandomElement(allPlayers);
    target.addHealth(1);

    player.addSteps([{ type: EDetailedStep.PlayerHeal, playerId: target.ID, amount: 1 }]);

    return false;
  }
}
