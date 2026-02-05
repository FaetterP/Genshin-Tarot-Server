import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { SearingOnslaughtPlus } from "./SearingOnslaughtPlus";

export class SearingOnslaught extends Card {
  public get Name(): string {
    return "SearingOnslaught";
  }

  constructor() {
    super(2);
  }

  get Upgrade() {
    return SearingOnslaughtPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const enemies = [...ctx.enemies, ...ctx.enemies, ...ctx.enemies];
    enemies.length = 3;

    ctx.addToSteps(
      [0, 1, 2].map((i) => ({
        type: "enemy_take_damage" as const,
        enemyId: enemies[i].ID,
        damage: 2,
        isPiercing: false,
        element: "Pyro",
      }))
    );

    for (let i = 0; i < 3; i++) {
      const attack: Attack = {
        damage: 2,
        element: new Pyro(),
        player: ctx.player,
      };
      enemies[i].applyAttack(attack);
    }
  }
}
