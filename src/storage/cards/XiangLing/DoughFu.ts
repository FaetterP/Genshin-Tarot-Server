import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { AttackCard } from "../AttackCard";

export class DoughFu extends AttackCard {
  public get Name(): string {
    return "DoughFu";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(1)) {
      // TODO
    }
  }
}
