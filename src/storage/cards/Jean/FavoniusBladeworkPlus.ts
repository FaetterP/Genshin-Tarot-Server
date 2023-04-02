import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { AttackCard } from "../AttackCard";

export class FavoniusBladeworkPlus extends AttackCard {
  public get Name(): string {
    return "FavoniusBladeworkPlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 2,
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    ctx.attacker.addEnergy(2);
    ctx.attacker.addHealth(2);
  }
}
