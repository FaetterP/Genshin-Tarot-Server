import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class FireworkFlareUp extends AttackCard {
  public get Name(): string {
    return "FireworkFlareUp";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = { damage: 2, isRange: true, player: ctx.attacker };
    ctx.enemy.applyAttack(attack);

    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Pyro().Name
      )
    ) {
      ctx.attacker.addActionPoints(1);
    }
  }
}
