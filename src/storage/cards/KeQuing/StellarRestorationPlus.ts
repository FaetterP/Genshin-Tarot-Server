import { CardAttackContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { AttackCard } from "../AttackCard";

export class StellarRestorationPlus extends AttackCard {
  public get Name(): string {
    return "StellarRestorationPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Electro(), ctx.attacker);
    // TODO attack extra 2 enemies

    ctx.attacker.addEnergy(2);
  }
}
