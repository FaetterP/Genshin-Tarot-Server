import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class SharpshooterPlus extends AttackCard {
  public get Name(): string {
    return "SharpshooterPlus";
  }

  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      player: ctx.attacker,
      isRange: true,
      isPiercing: true,
    };

    if (ctx.enemy.Shield === 0) {
      attack.damage = 3;
    }

    ctx.enemy.applyAttack(attack);
  }
}
