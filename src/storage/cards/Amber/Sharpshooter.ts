import { Player } from "../../../Player";
import { Attack, constructorSetupAttack } from "../../../utils/gameplay/Attack";
import { Pyro } from "../../elements/Pyro";
import { Enemy } from "../../enemies/Enemy";
import { AttackCard } from "../AttackCard";

export class Sharpshooter extends AttackCard {
  constructor() {
    super(0);
  }

  attack(ctx: { attacker: Player; enemy: Enemy }): void {
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
