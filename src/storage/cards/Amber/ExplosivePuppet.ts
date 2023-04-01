import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class ExplosivePuppet extends AttackCard {
  public get Name(): string {
    return "ExplosivePuppet";
  }

  constructor() {
    super(2);
  }

  attack(ctx: CardAttackContext): void {
    ctx.enemy.addStun();

    for (const enemy of ctx.attacker.Enemies) {
      const attack: Attack = {
        damage: 2,
        element: new Pyro(),
        player: ctx.attacker,
      };

      enemy.applyAttack(attack);
    }
  }
}
