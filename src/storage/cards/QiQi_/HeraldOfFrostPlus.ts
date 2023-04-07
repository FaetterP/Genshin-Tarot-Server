import { CardAttackContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { AttackCard } from "../AttackCard";

export class HeraldOfFrostPlus extends AttackCard {
  public get Name(): string {
    return "HeraldOfFrostPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.applyElement(new Cryo(), ctx.attacker);
    // TODO следующий, кто ударит этого же врага, отрегенит 3 хп и 2 энергии
  }
}
