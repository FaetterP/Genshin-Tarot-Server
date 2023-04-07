import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class GaryuuBladework extends AttackCard {
  public get Name(): string {
    return "GaryuuBladework";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = { damage: 3, player: ctx.attacker };
    ctx.enemy.applyAttack(attack);
  }
}
