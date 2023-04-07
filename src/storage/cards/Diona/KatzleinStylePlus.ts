import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class KatzleinStylePlus extends AttackCard {
  public get Name(): string {
    return "KatzleinStylePlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      isRange: true,
      player: ctx.attacker,
    };

    if (ctx.attacker.Shields > 0) {
      attack.damage = 5;
    }

    ctx.enemy.applyAttack(attack);
  }
}
