import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class RippleOfFate extends AttackCard {
  public get Name(): string {
    return "RippleOfFate";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Hydro(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    ctx.attacker.drawCard();
  }
}
