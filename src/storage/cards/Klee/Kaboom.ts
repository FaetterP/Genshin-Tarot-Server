import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class Kaboom extends AttackCard {
  public get Name(): string {
    return "Kaboom";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      player: ctx.attacker,
      element: new Pyro(),
    };
    ctx.enemy.applyAttack(attack);

    ctx.attacker.addEnergy(1);
  }
}
