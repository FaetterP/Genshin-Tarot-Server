import { CardAttackContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class HeraldOfFrost extends AttackCard {
  public get Name(): string {
    return "HeraldOfFrost";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Cryo(), ctx.attacker);
    // TODO следующий, кто ударит этого же врага, отрегенит 2 хп
  }
}
