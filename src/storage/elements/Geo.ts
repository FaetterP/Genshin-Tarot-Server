import { ElementReactionContext } from "../../types/functionsContext";
import { EElement } from "../../types/general";
import { BaseElement } from "./BaseElement";

export class Geo extends BaseElement {
  public get Name() {
    return EElement.Geo;
  }

  reaction(ctx: ElementReactionContext) {
    ctx.player.addEnergy(2);
    ctx.player.addShield(2);
  }
}
