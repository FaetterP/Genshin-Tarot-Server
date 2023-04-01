import {
  CardAttackContext,
  CardUseContext,
} from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { UseableCard } from "../UseableCard";

export class OceanbornPlus extends UseableCard {
  public get Name(): string {
    return "OceanbornPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage: 2,
        player: ctx.player,
      };
      // TODO 4 damage
      enemy.applyAttack(attack);
    }
  }
}
