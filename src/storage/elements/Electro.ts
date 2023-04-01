import { ElementReactionContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Element } from "./Element";

export class Electro extends Element {
  public get Name() {
    return "Electro";
  }

  reaction(ctx: ElementReactionContext) {
    const attack: Attack = { damage: 2, isPiercing: true, player: ctx.player };

    ctx.enemy.applyAttack(attack);

    ctx.player.addEnergy(1);
  }
}
