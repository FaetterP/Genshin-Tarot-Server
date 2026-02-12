import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { DemonbanePlus } from "./DemonbanePlus";

export class Demonbane extends Card {
  public get Name(): string {
    return "Demonbane";
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return DemonbanePlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];

    if (target.Shield > 0) {
      ctx.addToSteps([
        {
          type: "enemy_change_shield",
          enemyId: target.ID,
          delta: -1,
        },
      ]);
      target.addShields(-1);
    } else {
      ctx.addToSteps([
        {
          type: "enemy_take_damage",
          enemyId: target.ID,
          damage: 2,
          isPiercing: false,
        },
      ]);
      target.applyAttack({ damage: 2, player: ctx.player });
    }

    if (ctx.isUseAlternative && ctx.player.trySpendActonPoints(1)) {
      ctx.addToSteps([
        {
          type: "player_change_action_points",
          playerId: ctx.player.ID,
          delta: -1,
        },
      ]);
      ctx.player.addActionPoints(-1);
      if (target.Shield > 0) {
        ctx.addToSteps([
          {
            type: "enemy_change_shield",
            enemyId: target.ID,
            delta: -1,
          },
        ]);
        target.addShields(-1);
      } else {
        ctx.addToSteps([
          {
            type: "enemy_take_damage",
            enemyId: target.ID,
            damage: 2,
            isPiercing: false,
          },
        ]);
        target.applyAttack({ damage: 2, player: ctx.player });
      }
    }
  }
}
