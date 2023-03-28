import { Overheat } from "../cards/misc/Overheat";
import { ElementReactionContext } from "../../../types/functionsContext";
import { Element } from "./Element";

export class Pyro extends Element {
  reaction(ctx: ElementReactionContext) {
    ctx.player.addCardToDiscard(new Overheat());
  }
}
