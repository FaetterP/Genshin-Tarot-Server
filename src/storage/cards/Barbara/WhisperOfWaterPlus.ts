import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class WhisperOfWater extends Card {
  public get Name(): string {
    return "WhisperOfWaterPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.player.addHealth(2);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(2);
    }
  }
}
