import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { EElement, ECardType } from "../../../types/enums";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { WhisperOfWaterPlus as WhisperOfWaterPlus } from "./WhisperOfWaterPlus";

export class WhisperOfWater extends Card {
  public get Name(): string {
    return "WhisperOfWater";
  }

  constructor() {
    super(1, ECardType.Attack);
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
        element: EElement.Hydro,
      },
      {
        type: "draw_cards",
        playerId: ctx.player.ID,
        cards: [drawn.getPrimitive()],
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
