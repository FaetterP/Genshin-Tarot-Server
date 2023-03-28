import { ElementReactionContext } from "../../../types/functionsContext";
import { Element } from "./Element";

export class Cryo extends Element {
  reaction(ctx: ElementReactionContext) {
    ctx.player.addEnergy(2);

    ctx.enemy.addShields(-1);
  }
}
