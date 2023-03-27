import { ElementReactionContext } from "../../../types/functionsContext";
export abstract class Element {
  abstract reaction(ctx: ElementReactionContext): void;
}
