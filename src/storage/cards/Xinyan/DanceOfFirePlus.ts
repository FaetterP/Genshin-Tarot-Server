import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class DanceOfFirePlus extends AttackCard {
  public get Name(): string {
    return "DanceOfFirePlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    for (const enemy of ctx.attacker.Enemies) {
      const attack: Attack = { damage: 1, player: ctx.attacker };
      if (ctx.attacker.Shields > 0) {
        attack.damage = 3;
      }
      enemy.applyAttack(attack);
    }
  }
}
