import { Overheat } from "../cards/misc/Overheat";
import { ElementReactionContext } from "../../../types/functionsContext";

export class Pyro extends Element {
  reaction(ctx: ElementReactionContext) {
    ctx.player.addCardToDiscard(new Overheat());
  }
}
