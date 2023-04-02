import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Electro } from "../../elements/Electro";
import { AttackCard } from "../AttackCard";

export class Nightrider extends AttackCard {
  public get Name(): string {
    return "Nightrider";
  }

  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      element: new Electro(),
      player: ctx.attacker,
    };
    ctx.enemy.applyAttack(attack);

    // TODO
  }
}
