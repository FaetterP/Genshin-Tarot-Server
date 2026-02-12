import { ElementReactionContext } from "../../types/functionsContext";
import { EElement } from "../../types/general";
import { BaseElement } from "./BaseElement";

export class Cryo extends BaseElement {
  public get Name() {
    return EElement.Cryo;
  }

  reaction(ctx: ElementReactionContext) {
    ctx.player.addEnergy(2);

    ctx.enemy.addShields(-1);
  }
}
