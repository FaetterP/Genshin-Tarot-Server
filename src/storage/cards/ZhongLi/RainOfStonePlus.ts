import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Geo } from "../../elements/Geo";
import { AttackCard } from "../AttackCard";

export class RainOfStone extends AttackCard {
  public get Name(): string {
    return "RainOfStone";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      element: new Geo(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    if (ctx.isUseAlternative && ctx.attacker.trySpendEnergy(1)) {
      ctx.attacker.addActionPoints(1);
    }
  }
}
