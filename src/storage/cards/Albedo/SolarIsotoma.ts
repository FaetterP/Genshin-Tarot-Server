import { CardAttackContext } from "../../../../types/functionsContext";
import { AttackCard } from "../AttackCard";

export class SolarIsotoma extends AttackCard {
  public get Name(): string {
    return "SolarIsotoma";
  }

  constructor() {
    super(2);
  }

  attack(ctx: CardAttackContext): void {
    // TODO
  }
}
