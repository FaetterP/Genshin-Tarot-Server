import { ElementReactionContext } from "../../types/functionsContext";
export abstract class Element {
  abstract get Name(): string;

  abstract reaction(ctx: ElementReactionContext): void;
}
