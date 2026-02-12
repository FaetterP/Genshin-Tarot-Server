import { ElementReactionContext } from "../../types/functionsContext";
import { EElement } from "../../types/enums";
import { BaseElement } from "./BaseElement";

export class Hydro extends BaseElement {
  public get Name() {
    return EElement.Hydro;
  }

  reaction(ctx: ElementReactionContext) {
    ctx.player.addEnergy(3);
  }
}
