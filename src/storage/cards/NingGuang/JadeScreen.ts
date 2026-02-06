import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "../Card";
import { JadeScreenPlus } from "./JadeScreenPlus";

export class JadeScreen extends Card {
  public get Name(): string {
    return "JadeScreen";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return JadeScreenPlus;
  }

  use(ctx: CardUseContext): void {
    const targetPlayer = ctx.selectedPlayer ?? ctx.player;
    ctx.addToSteps([
      {
        type: "player_change_shield",
        playerId: targetPlayer.ID,
        delta: 3,
      },
    ]);
    targetPlayer.addShield(3);
  }
}
