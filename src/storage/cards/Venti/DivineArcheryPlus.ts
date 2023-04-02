import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class DivineArcheryPlus extends AttackCard {
  public get Name(): string {
    return "DivineArcheryPlus";
  }

  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.attacker,
    };

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(1)) {
      attack.damage = 3;
    }

    ctx.enemy.applyAttack(attack);
  }
}
