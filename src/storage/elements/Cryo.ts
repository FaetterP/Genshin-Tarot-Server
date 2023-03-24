import { elementReactionContext } from "./Element";

export class Cryo extends Element {
  reaction(ctx: elementReactionContext) {
    ctx.player.addEnergy(2);
    // destroy extra shield
  }
}
