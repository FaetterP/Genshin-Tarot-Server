import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class SteelFang extends AttackCard {
  public get Name(): string {
    return "SteelFang";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    if (ctx.enemy.Shield > 0) {
      ctx.enemy.addShields(-1);
    } else {
      const attack: Attack = { damage: 2, player: ctx.attacker };
      ctx.enemy.applyAttack(attack);
    }

    // TODO
  }
}
