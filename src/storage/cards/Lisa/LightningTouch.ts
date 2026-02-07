import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { LightningTouchPlus } from "./LightningTouchPlus";

export class LightningTouch extends Card {
  public get Name(): string {
    return "LightningTouch";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return LightningTouchPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const drawn = ctx.player.drawCard();
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element: "Electro",
      },
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [drawn.getPrimitive()],
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Electro(),
      player: ctx.player,
    });
  }
}
