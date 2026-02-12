import { ElementReactionContext } from "../../types/functionsContext";
import { EElement } from "../../types/enums";
import { Dash } from "../cards/misc/Dash";
import { BaseElement } from "./BaseElement";

export class Anemo extends BaseElement {
  public get Name() {
    return EElement.Anemo;
  }

  reaction(ctx: ElementReactionContext) {
    ctx.player.addCardToDiscard(new Dash());
  }
}
