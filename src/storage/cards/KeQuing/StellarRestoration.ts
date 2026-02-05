import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class StellarRestoration extends Card {
  public get Name(): string {
    return "StellarRestoration";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: "enemy_get_element", enemyId: target.ID, element: "Electro" },
    ]);
    target.applyElement(new Electro(), ctx.player);
    // TODO
  }
}
