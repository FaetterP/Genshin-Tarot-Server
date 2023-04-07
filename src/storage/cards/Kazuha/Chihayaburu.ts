import { CardAttackContext } from "../../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class Chihayaburu extends AttackCard {
  public get Name(): string {
    return "Chihayaburu";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Anemo(), ctx.attacker)
    // TODO
  }
}
