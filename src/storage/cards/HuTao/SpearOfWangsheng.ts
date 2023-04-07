import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class SpearOfWangsheng extends AttackCard {
  public get Name(): string {
    return "SpearOfWangsheng";
  }

  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      player: ctx.attacker,
    };

    if (ctx.attacker.Health <= 7) {
      attack.damage = 2;
    }

    ctx.enemy.applyAttack(attack);
  }
}
