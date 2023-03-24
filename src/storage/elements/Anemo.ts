import { Dash } from "../cards/misc/Dash";
import { elementReactionContext } from "./Element";

export class Anemo extends Element {
  reaction(ctx: elementReactionContext) {
    ctx.player.addCardToDiscard(new Dash());
  }
}
