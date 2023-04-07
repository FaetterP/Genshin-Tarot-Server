import { CardAttackContext } from "../../../../types/functionsContext";
import { AttackCard } from "../AttackCard";

export class WeissBladework extends AttackCard {
  public get Name(): string {
    return "WeissBladework";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    // TODO
  }
}
