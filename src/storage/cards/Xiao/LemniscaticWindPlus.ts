import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class LemniscaticWindPlus extends AttackCard {
  public get Name(): string {
    return "LemniscaticWindPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.attacker,
    };
    // if last played card is Dash, 5 damage
    ctx.enemy.applyAttack(attack);
  }
}
