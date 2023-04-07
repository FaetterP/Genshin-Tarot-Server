import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class RavagingConfessionPlus extends AttackCard {
  public get Name(): string {
    return "RavagingConfessionPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 3,
      isRange: true,
      element: new Cryo(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
