import { ElementReactionContext } from "../../../types/functionsContext";

export class Geo extends Element {
  reaction(ctx: ElementReactionContext) {
    ctx.player.addEnergy(2);
    ctx.player.addShield(2);
  }
}
