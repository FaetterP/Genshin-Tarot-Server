import { Player } from "../../../game/Player";
import { Attack, constructorSetupAttack } from "../../../game/Attack";
import { Pyro } from "../../elements/Pyro";
import { Enemy } from "../../enemies/Enemy";
import { AttackCard } from "../AttackCard";

export class SharpshooterPlus extends AttackCard {
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

    if (ctx.enemy.Shield === 0) {
      attackSetup.damage = 3;
    }

    const attack = new Attack(attackSetup);

    ctx.enemy.applyAttack(attack);
  }
}
