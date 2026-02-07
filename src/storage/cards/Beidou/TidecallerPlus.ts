import { CardUseContext } from "../../../types/functionsContext";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { Overheat } from "../misc/Overheat";

export class TidecallerPlus extends Card {
  public get Name(): string {
    return "TidecallerPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    const overheatCard = new Overheat();
    ctx.addToSteps([
      ...ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: "Electro",
      })),
      {
        type: "player_change_shield",
        playerId: ctx.player.ID,
        delta: 3,
      },
      {
        type: "add_card",
        playerId: ctx.player.ID,
        card: overheatCard.getPrimitive(),
        to: "hand",
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Electro(), ctx.player);
    }
    ctx.player.addShield(3);
    ctx.player.addCardToHand(overheatCard);
  }
}
