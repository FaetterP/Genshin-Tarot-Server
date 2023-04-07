import { CardAttackContext } from "../../../../types/functionsContext";
import { AttackCard } from "../AttackCard";

export class WeissBladeworkPlus extends AttackCard {
  public get Name(): string {
    return "WeissBladeworkPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    // TODO
  }
}
