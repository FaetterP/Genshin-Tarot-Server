import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class GuhuaStylePlus extends AttackCard {
  public get Name(): string {
    return "GuhuaStylePlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = { damage: 3, player: ctx.attacker };

    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Hydro().Name
      )
    ) {
      attack.damage = 5;
    }

    ctx.enemy.applyAttack(attack);
  }
}
