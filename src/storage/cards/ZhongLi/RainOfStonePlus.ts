import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class RainOfStone extends Card {
  public get Name(): string {
    return "RainOfStone";
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
      element: new Geo(),
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
