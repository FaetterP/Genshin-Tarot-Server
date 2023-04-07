import { CardAttackContext } from "../../../../types/functionsContext";
import { AttackCard } from "../AttackCard";

export class SignedEdict extends AttackCard {
  public get Name(): string {
    return "SignedEdict";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    // TODO
  }
}
