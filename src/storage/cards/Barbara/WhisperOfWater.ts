import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { WhisperOfWater as WhisperOfWaterPlus } from "./WhisperOfWaterPlus";

export class WhisperOfWater extends Card {
  public get Name(): string {
    return "WhisperOfWater";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return WhisperOfWaterPlus;
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
        cards: [{ cardId: drawn.ID, name: drawn.Name }],
      },
    ]);

    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Hydro(),
      player: ctx.player,
    };
    target.applyAttack(attack);
  }
}
