import { elementReactionContext } from "./Element";

export class Geo extends Element {
  reaction(ctx: elementReactionContext) {
    ctx.player.addEnergy(2);
    ctx.player.addShield(2);
  }
}
