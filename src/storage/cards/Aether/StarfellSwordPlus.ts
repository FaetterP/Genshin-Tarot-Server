import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class StarfellSwordPlus extends AttackCard {
  public get Name(): string {
    return "StarfellSwordPlus"
  }

  constructor() {
    super(1);
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
