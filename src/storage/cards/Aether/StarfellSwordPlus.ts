import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../game/Attack";
import { AttackCard } from "../AttackCard";

export class StarfellSwordPlus extends AttackCard {
  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    for (const enemy of ctx.attacker.Enemies) {
      const attackSetup = { damage: 2, isPiercing: true, player: ctx.attacker };
      const attack = new Attack(attackSetup);

      enemy.applyAttack(attack);
    }
  }
}
