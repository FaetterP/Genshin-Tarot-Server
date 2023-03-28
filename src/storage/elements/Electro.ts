import { Attack } from "../../game/Attack";
import { ElementReactionContext } from "../../../types/functionsContext";
import { Element } from "./Element";

export class Electro extends Element {
  reaction(ctx: ElementReactionContext) {
    const attackSetup = { damage: 2, isPiercing: true, player: ctx.player };
    const attack = new Attack(attackSetup);

    ctx.enemy.applyAttack(attack);

    ctx.player.addEnergy(1);
  }
}
