import { CardAttackContext } from "../../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class AnemoHypostatis extends AttackCard {
  public get Name(): string {
    return "AnemoHypostatis";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Anemo(), ctx.attacker);
    // TODO
  }
}
