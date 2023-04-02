import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { AttackCard } from "../AttackCard";

export class SearingOnslaught extends AttackCard {
  public get Name(): string {
    return "SearingOnslaught";
  }

  constructor() {
    super(2);
  }

  attack(ctx: CardAttackContext): void {
    for (let i = 0; i < 3; i++) {
      const attack: Attack = {
        damage: 2,
        element: new Pyro(),
        player: ctx.attacker,
      };
      ctx.enemy.applyAttack(attack); // TODO three different enemies
    }
  }
}
