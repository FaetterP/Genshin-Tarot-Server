import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class SteelFangPlus extends AttackCard {
  public get Name(): string {
    return "SteelFangPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.addShields(-1);

    const attack: Attack = { damage: 2, player: ctx.attacker };
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
