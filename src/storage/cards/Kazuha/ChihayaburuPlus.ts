import {
  CardAttackContext,
  CardUseContext,
} from "../../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { UseableCard } from "../UseableCard";

export class ChihayaburuPlus extends UseableCard {
  public get Name(): string {
    return "ChihayaburuPlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }

    ctx.player.drawCard();
    ctx.player.drawCard();
  }
}
