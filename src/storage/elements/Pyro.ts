import { Overheat } from "../cards/misc/Overheat";
import { ElementReactionContext } from "../../types/functionsContext";
import { BaseElement } from "./BaseElement";
import { EElement } from "../../types/enums";

export class Pyro extends BaseElement {
  public get Name() {
    return EElement.Pyro;
  }

  reaction(ctx: ElementReactionContext) {
    ctx.player.addCardToDiscard(new Overheat());
  }
}
