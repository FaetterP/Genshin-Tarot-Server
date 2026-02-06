import { CardUseContext } from "../../../types/functionsContext";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { SweepingFervorPlus } from "./SweepingFervorPlus";

export class SweepingFervor extends Card {
  public get Name(): string {
    return "SweepingFervor";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return SweepingFervorPlus;
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      {
        type: "player_change_shield",
        playerId: ctx.player.ID,
        delta: 3,
      },
      ...ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Pyro",
      })),
    ]);
    ctx.player.addShield(3);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Pyro(), ctx.player);
    }
  }
}
