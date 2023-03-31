import { ElementReactionContext } from "../../../types/functionsContext";
import { Dash } from "../cards/misc/Dash";
import { Element } from "./Element";

export class Anemo extends Element {
  public get Name() {
    return "Anemo";
  }

  reaction(ctx: ElementReactionContext) {
    ctx.player.addCardToDiscard(new Dash());
  }
}
