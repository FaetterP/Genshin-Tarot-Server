import { ElementReactionContext } from "../../../types/functionsContext";

export class Hydro extends Element {
  reaction(ctx: ElementReactionContext) {
    ctx.player.addEnergy(3);
  }
}
