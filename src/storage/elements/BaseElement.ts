import { ElementReactionContext } from "../../types/functionsContext";
import { EElement } from "../../types/general";

export abstract class BaseElement {
  abstract get Name(): EElement;

  abstract reaction(ctx: ElementReactionContext): void;
}
