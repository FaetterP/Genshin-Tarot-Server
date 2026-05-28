import { EPlayerEffect, EDetailedStep } from "../../types/enums";
import { Player } from "../../game/Player";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class BreastplateEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.Breastplate;
  }

  public onAttack(player: Player, enemy: Enemy): boolean {
    player.addHealth(1);
    player.addSteps([{ type: EDetailedStep.PlayerHeal, playerId: player.ID, amount: 1 }]);
    return false;
  }
}
