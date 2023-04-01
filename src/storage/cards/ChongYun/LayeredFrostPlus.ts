import { CardAttackContext } from "../../../../types/functionsContext";
import { AttackCard } from "../AttackCard";

export class LayeredFrostPlus extends AttackCard {
  public get Name(): string {
    return "LayeredFrostPlus";
  }

  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    ctx.attacker.drawCard();
    // TODO
  }
}
