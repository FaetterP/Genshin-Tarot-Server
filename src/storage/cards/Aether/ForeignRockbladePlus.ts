import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Geo } from "../../elements/Geo";
import { AttackCard } from "../AttackCard";

export class ForeignRockbladePlus extends AttackCard {
  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attack: Attack = {
      damage: 3,
      player: ctx.attacker,
      element: new Geo(),
    };
    ctx.enemy.applyAttack(attack);

    ctx.attacker.addEnergy(2);
  }
}
