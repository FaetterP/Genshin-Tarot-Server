import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class FavoniusBladework extends AttackCard {
  public get Name(): string {
    return "FavoniusBladework";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    if (
      ctx.enemy.Elements.map((element) => element.Name).includes(
        new Anemo().Name
      )
    ) {
      ctx.attacker.addEnergy(2);
    }

    const attack: Attack = {
      damage: 2,
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);
  }
}
