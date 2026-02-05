import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class DemonbanePlus extends Card {
  public get Name(): string {
    return "DemonbanePlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    if (target.isContainsElement(new Cryo())) {
      ctx.addToSteps([
        {
          type: "enemy_take_damage",
          enemyId: target.ID,
          damage: 4,
          isPiercing: false,
          element: "Cryo",
        },
      ]);
      target.applyAttack({
        damage: 4,
        element: new Cryo(),
        player: ctx.player,
      });
    } else {
      ctx.addToSteps(
        ctx.player.Enemies.map((enemy) => ({
          type: "enemy_take_damage" as const,
          enemyId: enemy.ID,
          damage: 2,
          isPiercing: false,
        }))
      );
      for (const enemy of ctx.player.Enemies) {
        enemy.applyAttack({ damage: 2, player: ctx.player });
      }
    }
  }
}
