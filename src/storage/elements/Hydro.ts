import { ElementReactionContext } from "../../../types/functionsContext";
import { Element } from "./Element";

export class Hydro extends Element {
  public get Name() {
    return "Hydro";
  }

  reaction(ctx: ElementReactionContext) {
    ctx.player.addEnergy(3);
  }
}
