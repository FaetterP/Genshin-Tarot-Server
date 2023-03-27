import { ElementReactionContext } from "../../../types/functionsContext";
import { Dash } from "../cards/misc/Dash";

export class Anemo extends Element {
  reaction(ctx: ElementReactionContext) {
    ctx.player.addCardToDiscard(new Dash());
  }
}
