import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class JadeScreenPlus extends Card {
  public get Name(): string {
    return "JadeScreenPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (ctx.selectedPlayer) {
      ctx.addToSteps([
        {
          type: "player_change_shield",
          playerId: ctx.selectedPlayer.ID,
          delta: 3,
        },
        {
          type: "player_change_energy",
          playerId: ctx.selectedPlayer.ID,
          delta: 1,
        }
      ]);
      ctx.selectedPlayer.addShield(3);
      ctx.selectedPlayer.addEnergy(1);
    }
    ctx.addToSteps([
      {
        type: "player_change_shield",
        playerId: ctx.player.ID,
        delta: 3,
      },
      {
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 1,
      }
    ]);

    ctx.player.addShield(3);
    ctx.player.addEnergy(1);
  }
}
