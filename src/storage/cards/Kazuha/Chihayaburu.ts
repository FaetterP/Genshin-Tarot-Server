import { CardUseContext } from "../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { ChihayaburuPlus } from "./ChihayaburuPlus";

export class Chihayaburu extends Card {
  public get Name(): string {
    return "Chihayaburu";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return ChihayaburuPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: "enemy_get_element", enemyId: target.ID, element: "Anemo" },
    ]);
    target.applyElement(new Anemo(), ctx.player);
    // TODO
  }
}
