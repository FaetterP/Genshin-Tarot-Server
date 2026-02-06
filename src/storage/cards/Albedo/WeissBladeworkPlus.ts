import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { SolarIsotomaEffect } from "../../effects/SolarIsotomaEffect";
import { Card } from "../Card";

export class WeissBladeworkPlus extends Card {
  public get Name(): string {
    return "WeissBladeworkPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = { damage: 3, player: ctx.player };
    ctx.enemies[0].applyAttack(attack);

    if (ctx.player.isContainsEffect(new SolarIsotomaEffect())) {
      ctx.addToSteps([
        {
          type: "player_change_action_points",
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addExtraActionPoints(1);
      ctx.player.drawCard();
    }
  }
}
