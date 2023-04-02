import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class SparklingScatterPlus extends AttackCard {
  public get Name(): string {
    return "SparklingScatterPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      isRange: true,
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    // TODO attack two enemies
  }
}
