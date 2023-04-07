import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";

export class GuhuaStyle extends AttackCard {
  public get Name(): string {
    return "GuhuaStyle";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Hydro().Name
      )
    ) {
      ctx.attacker.addEnergy(2);
    }

    const attack: Attack = { damage: 2, player: ctx.attacker };
    ctx.enemy.applyAttack(attack);
  }
}
