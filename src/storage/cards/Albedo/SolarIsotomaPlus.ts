import { CardAttackContext } from "../../../../types/functionsContext";
import { AttackCard } from "../AttackCard";

export class SolarIsotomaPlus extends AttackCard {
  public get Name(): string {
    return "SolarIsotomaPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    // TODO
  }
}
