import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class StrikeOfFortunePlus extends AttackCard {
  public get Name(): string {
    return "StrikeOfFortunePlus";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 3,
      player: ctx.attacker,
    };

    if (ctx.attacker.Health <= 7) {
      attack.damage += 1;
      ctx.attacker.addEnergy(3);
    }

    ctx.enemy.applyAttack(attack);
  }
}
