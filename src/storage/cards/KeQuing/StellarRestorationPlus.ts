import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class StellarRestorationPlus extends Card {
  public get Name(): string {
    return "StellarRestorationPlus";
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
      { type: "enemy_get_element", enemyId: target.ID, element: "Electro" },
      { type: "enemy_get_element", enemyId: target.ID, element: "Electro" },
      {
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    for (let i = 0; i < 3; i++) {
      target.applyElement(new Electro(), ctx.player);
    }
    ctx.player.addEnergy(2);
  }
}
