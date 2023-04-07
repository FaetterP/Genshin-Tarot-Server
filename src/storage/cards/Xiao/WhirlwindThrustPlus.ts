import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class WhirlwindThrustPlus extends AttackCard {
  public get Name(): string {
    return "WhirlwindThrustPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(1)) {
      ctx.attacker.addActionPoints(1);
    }
  }
}
