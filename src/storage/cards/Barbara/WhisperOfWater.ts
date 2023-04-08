import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class WhisperOfWater extends Card {
  public get Name(): string {
    return "WhisperOfWater";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Hydro(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    ctx.player.drawCard();
  }
}
