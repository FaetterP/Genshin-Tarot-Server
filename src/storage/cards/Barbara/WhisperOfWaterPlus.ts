import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class WhisperOfWater extends UseableCard {
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
