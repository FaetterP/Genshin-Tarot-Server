import { CardUseContext } from "../../../types/functionsContext";
import { ECard, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class WhisperOfWaterPlus extends Card {
  public get Name(): ECard {
    return ECard.WhisperOfWaterPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    ctx.player.addHealth(2);

    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(1);
    }
  }
}
