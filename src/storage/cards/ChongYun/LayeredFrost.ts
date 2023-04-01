import { CardAttackContext } from "../../../../types/functionsContext";
import { AttackCard } from "../AttackCard";

export class LayeredFrost extends AttackCard {
  public get Name(): string {
    return "LayeredFrost";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.attacker.drawCard();
    // TODO
  }
}
