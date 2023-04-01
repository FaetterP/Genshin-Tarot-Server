import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class ForeignRockblade extends AttackCard {
  public get Name(): string {
    return "ForeignRockblade";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = { damage: 3, player: ctx.attacker };

    ctx.enemy.applyAttack(attack);
  }
}
