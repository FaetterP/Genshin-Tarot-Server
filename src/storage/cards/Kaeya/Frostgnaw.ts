import { CardUseContext } from "../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { FrostgnawPlus } from "./FrostgnawPlus";

export class Frostgnaw extends Card {
  public get Name(): string {
    return "Frostgnaw";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return FrostgnawPlus;
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
        delta: 1,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }
    ctx.player.addEnergy(1);
  }
}
