import { CardAttackContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class IcetideVortexPlus extends AttackCard {
  public get Name(): string {
    return "IcetideVortexPlus";
  }

  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Cryo(), ctx.attacker);
    // TODO
  }
}
