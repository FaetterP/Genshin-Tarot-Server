import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";
import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";

export class Sharpshooter extends AttackCard {
  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      player: ctx.attacker,
      isRange: true,
      isPiercing: true,
    };

    if (ctx.attacker.trySpendEnergy(1)) {
      attack.element = new Pyro();
    }

    ctx.enemy.applyAttack(attack);
  }
}
