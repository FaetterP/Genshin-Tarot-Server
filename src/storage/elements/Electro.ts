import { ElementReactionContext } from "../../types/functionsContext";
import { Attack } from "../../types/general";
import { BaseElement } from "./BaseElement";
import { EElement } from "../../types/enums";

export class Electro extends BaseElement {
  public get Name() {
    return EElement.Electro;
  }

  reaction(ctx: ElementReactionContext) {
    const attack: Attack = { damage: 2, isPiercing: true, player: ctx.player };

    ctx.enemy.applyAttack(attack);

    ctx.player.addEnergy(1);
  }
}
