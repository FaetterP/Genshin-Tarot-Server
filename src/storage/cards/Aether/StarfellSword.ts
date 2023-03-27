import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../game/Attack";
import { AttackCard } from "../AttackCard";

export class StarfellSword extends AttackCard {
  constructor() {
    super(2);
  }

  attack(ctx: CardAttackContext): void {
    for (const enemy of ctx.attacker.Enemies) {
      const attackSetup = { damage: 2, isPiercing: true, player: ctx.attacker };
      const attack = new Attack(attackSetup);

      enemy.applyAttack(attack);
    }
  }
}
