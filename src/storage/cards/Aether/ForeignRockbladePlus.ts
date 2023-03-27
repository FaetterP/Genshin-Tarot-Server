import { CardAttackContext } from "../../../../types/functionsContext";
import { Attack } from "../../../game/Attack";
import { Geo } from "../../elements/Geo";
import { AttackCard } from "../AttackCard";

export class ForeignRockbladePlus extends AttackCard {
  constructor() {
    super(1);
  }

  attack(ctx: CardAttackContext): void {
    const attackSetup = { damage: 3, player: ctx.attacker, element: new Geo() };
    const attack = new Attack(attackSetup);
    ctx.enemy.applyAttack(attack);

    ctx.attacker.addEnergy(2);
  }
}
