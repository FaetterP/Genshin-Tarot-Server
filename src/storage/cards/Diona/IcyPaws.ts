import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { IcyPawsPlus } from "./IcyPawsPlus";

export class IcyPaws extends Card {
  public get Name(): string {
    return "IcyPaws";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return IcyPawsPlus;
  }

  use(ctx: CardUseContext): void {
    if (ctx.isUseAlternative) {
      ctx.addToSteps(
        ctx.player.Enemies.map((enemy) => ({
          type: "enemy_get_element" as const,
          enemyId: enemy.ID,
          element: "Cryo",
        }))
      );
      for (const enemy of ctx.player.Enemies) {
        enemy.applyElement(new Cryo(), ctx.player);
      }
    } else {
      ctx.addToSteps([
        {
          type: "player_change_shield",
          playerId: ctx.player.ID,
          delta: 3,
        },
      ]);
      ctx.player.addShield(3);
    }

    // TODO trash all burn cards
  }
}
