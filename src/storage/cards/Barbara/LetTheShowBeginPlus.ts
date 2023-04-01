import {
  CardAttackContext,
  CardUseContext,
} from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { AttackCard } from "../AttackCard";
import { UseableCard } from "../UseableCard";

export class LetTheShowBeginPlus extends UseableCard {
  public get Name(): string {
    return "LetTheShowBeginPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Hydro(), ctx.player);
    }
    // TODO all attacks heal 1
  }
}
