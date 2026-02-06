import { CardUseContext } from "../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class FrostgnawPlus extends Card {
  public get Name(): string {
    return "FrostgnawPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      ...ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Cryo",
      })),
      {
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }
    ctx.player.addEnergy(2);
    ctx.player.addHealth(2);
  }
}
