import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class TemperedSwordPlus extends AttackCard {
  public get Name(): string {
    return "TemperedSwordPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    if (ctx.enemy.Shield > 0) {
      ctx.enemy.addShields(-Number.MAX_VALUE);
    } else {
      const attack: Attack = {
        damage: 4,
        player: ctx.attacker,
      };
      ctx.enemy.applyAttack(attack);
    }
  }
}
