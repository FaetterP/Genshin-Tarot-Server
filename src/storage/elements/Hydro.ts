import { ElementReactionContext } from "../../../types/functionsContext";
import { Element } from "./Element";

export class Hydro extends Element {
  reaction(ctx: ElementReactionContext) {
    ctx.player.addEnergy(3);
  }
}
