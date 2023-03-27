import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "./Card";

export abstract class UseableCard extends Card {
  abstract use(ctx: CardUseContext): void;
}
