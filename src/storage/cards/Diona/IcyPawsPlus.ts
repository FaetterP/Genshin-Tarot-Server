import { CardUseContext } from "../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class IcyPawsPlus extends Card {
  public get Name(): string {
    return "IcyPawsPlus";
  }

  constructor() {
    super(1);
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
        element: "Cryo",
      })),
    ]);
    ctx.player.addShield(3);

    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }

    // TODO Trash all burn cards
  }
}
