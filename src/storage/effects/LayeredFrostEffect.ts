import { ECardType, EPlayerEffect } from "../../types/enums";
import { Player } from "../../game/Player";
import { Cryo } from "../elements/Cryo";
import { Enemy } from "../enemies/Enemy";
import { PlayerEffect } from "./PlayerEffect";

export class LayeredFrostEffect extends PlayerEffect {
  public get Name(): EPlayerEffect {
    return EPlayerEffect.LayeredFrost;
  }

  public override onAttack(player: Player, enemy: Enemy, cardType?: ECardType): boolean {
    if (cardType !== ECardType.Attack) return false;

    enemy.applyElement(new Cryo(), player);

    return false;
  }
}
