import { CardUseContext } from "../../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class ClawAndThunder extends Card {
  public get Name(): string {
    return "ClawAndThunder";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Electro",
      }))
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Electro(), ctx.player);
    }
    // TODO
  }
}
