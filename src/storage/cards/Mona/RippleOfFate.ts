import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { RippleOfFatePlus } from "./RippleOfFatePlus";

export class RippleOfFate extends Card {
  public get Name(): string {
    return "RippleOfFate";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return RippleOfFatePlus;
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
        element: "Hydro",
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
      element: new Hydro(),
      player: ctx.player,
    });
  }
}
