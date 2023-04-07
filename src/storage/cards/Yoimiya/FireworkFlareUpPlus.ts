import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class FireworkFlareUpPlus extends AttackCard {
  public get Name(): string {
    return "FireworkFlareUpPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = { damage: 2, isRange: true, element:new Pyro(), player: ctx.attacker };
    ctx.enemy.applyAttack(attack);
    // TODO attack 3 enemies
  }
}
