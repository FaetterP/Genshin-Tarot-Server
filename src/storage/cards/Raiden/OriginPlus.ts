import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { AttackCard } from "../AttackCard";

export class OriginPlus extends AttackCard {
  public get Name(): string {
    return "OriginPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    ctx.attacker.addEnergy(2);

    const attack: Attack = { damage: 2, player: ctx.attacker };

    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Electro().Name
      )
    ) {
      attack.damage = 5;
    }

    ctx.enemy.applyAttack(attack);
  }
}
