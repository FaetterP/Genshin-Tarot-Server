import { Attack, constructorSetupAttack } from "../../../game/Attack";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";
import { CardAttackContext } from "../../../../types/functionsContext";

export class Sharpshooter extends AttackCard {
  constructor() {
    super(0);
  }

  attack(ctx: CardAttackContext): void {
    const attackSetup: constructorSetupAttack = {
      damage: 1,
      player: ctx.attacker,
      isRange: true,
      isPiercing: true,
    };

    if (ctx.attacker.trySpendEnergy(1)) {
      attackSetup.element = new Pyro();
    }

    const attack = new Attack(attackSetup);

    ctx.enemy.applyAttack(attack);
  }
}
