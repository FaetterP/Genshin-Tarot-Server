import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { EElement, ETypeCard } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class FireworkFlareUpPlus extends Card {
  public get Name(): string {
    return "FireworkFlareUpPlus";
  }

  constructor() {
    super(1, ETypeCard.Attack);
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
        element: EElement.Pyro,
      }))
    );
    for (let i = 0; i < 3; i++) {
      enemies[i].applyAttack({
        damage: 2,
        isRange: true,
        element: new Pyro(),
        player: ctx.player,
      });
    }
  }
}
