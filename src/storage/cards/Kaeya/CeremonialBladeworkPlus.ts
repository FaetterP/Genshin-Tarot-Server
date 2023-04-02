import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { getRandomInteger } from "../../../utils/math";
import { AttackCard } from "../AttackCard";

export class CeremonialBladeworkPlus extends AttackCard {
  public get Name(): string {
    return "CeremonialBladeworkPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = { damage: 2, player: ctx.attacker };
    attack.damage += getRandomInteger(1, 7);
    ctx.enemy.applyAttack(attack);
  }
}
