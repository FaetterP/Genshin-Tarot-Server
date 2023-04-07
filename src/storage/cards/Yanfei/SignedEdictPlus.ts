import { CardAttackContext } from "../../../../types/functionsContext";
import { AttackCard } from "../AttackCard";

export class SignedEdictPlus extends AttackCard {
  public get Name(): string {
    return "SignedEdictPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    // TODO
  }
}
