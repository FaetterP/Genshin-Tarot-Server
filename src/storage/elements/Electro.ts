import { Attack } from "../../utils/gameplay/Attack";
import { elementReactionContext } from "./Element";

export class Electro extends Element {
  reaction(ctx: elementReactionContext) {
    const attackSetup = { damage: 2, isPiercing: true, player: ctx.player };
    const attack = new Attack(attackSetup);

    ctx.enemy.applyAttack(attack);

    // add 1 energy
  }
}
