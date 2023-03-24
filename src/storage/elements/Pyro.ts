import { Overheat } from "../cards/misc/Overheat";
import { elementReactionContext } from "./Element";

export class Pyro extends Element {
  reaction(ctx: elementReactionContext) {
    ctx.player.addCardToDiscard(new Overheat());
  }
}
