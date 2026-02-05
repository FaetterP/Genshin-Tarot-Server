import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class WhirlwindThrustPlus extends Card {
  public get Name(): string {
    return "WhirlwindThrustPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = {
      damage: 2,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.player,
    };
    ctx.enemies[0].applyAttack(attack);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(1)) {
      ctx.addToSteps([
        {
          type: "player_change_action_points",
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addExtraActionPoints(1);
    }
  }
}
