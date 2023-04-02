import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class DivineArchery extends AttackCard {
  public get Name(): string {
    return "DivineArchery";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.attacker,
    };

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(1)) {
      attack.element = new Anemo();
    }

    ctx.enemy.applyAttack(attack);
  }
}
