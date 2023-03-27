import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../game/Attack";
import { AttackCard } from "../AttackCard";

export class ForeignRockblade extends AttackCard {
  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attackSetup = { damage: 3, player: ctx.attacker };
    const attack = new Attack(attackSetup);

    ctx.enemy.applyAttack(attack);
  }
}
