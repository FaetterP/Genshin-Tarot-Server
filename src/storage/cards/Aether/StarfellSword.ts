import { CardAttackContext } from "../../../../types/functionsContext";
import { AttackCard } from "../AttackCard";
import { Attack } from "../../../../types/general";

export class StarfellSword extends AttackCard {
  public get Name(): string {
    return "StarfellSword";
  }

  constructor() {
    super(2);
  }

  attack(ctx: CardAttackContext): void {
    for (const enemy of ctx.attacker.Enemies) {
      const attack: Attack = {
        damage: 2,
        isPiercing: true,
        player: ctx.attacker,
      };

      enemy.applyAttack(attack);
    }
  }
}
