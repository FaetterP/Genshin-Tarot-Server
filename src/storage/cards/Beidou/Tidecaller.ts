import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class Tidecaller extends Card {
  public get Name(): string {
    return "Tidecaller";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      ...ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Electro",
      })),
      {
        type: "player_change_shield",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Electro(), ctx.player);
    }
    ctx.player.addShield(2);
  }
}
