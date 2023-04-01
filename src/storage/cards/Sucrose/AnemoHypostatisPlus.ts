import { CardAttackContext } from "../../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class AnemoHypostatisPlus extends AttackCard {
  public get Name(): string {
    return "AnemoHypostatisPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Anemo(), ctx.attacker);
    // TODO
  }
}
