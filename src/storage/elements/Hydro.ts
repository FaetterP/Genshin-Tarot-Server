import { elementReactionContext } from "./Element";

export class Hydro extends Element {
  reaction(ctx: elementReactionContext) {
    ctx.player.addEnergy(3);
  }
}
