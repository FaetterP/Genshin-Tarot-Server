import { CardAttackContext } from "../../../types/functionsContext";
import { Card } from "./Card";

export abstract class AttackCard extends Card {
  abstract attack(ctx: CardAttackContext): void;
}
