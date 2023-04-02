import { CardAttackContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { AttackCard } from "../AttackCard";

export class StellarRestoration extends AttackCard {
  public get Name(): string {
    return "StellarRestoration";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Electro(), ctx.attacker);
  }
}
