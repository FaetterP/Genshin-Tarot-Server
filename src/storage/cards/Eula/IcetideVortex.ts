import { CardAttackContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class IcetideVortex extends AttackCard {
  public get Name(): string {
    return "IcetideVortex";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Cryo(), ctx.attacker);
    // TODO
  }
}
