import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class FireworkFlareUpPlus extends Card {
  public get Name(): ECard {
    return ECard.FireworkFlareUpPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const enemies = [...ctx.enemies, ...ctx.enemies, ...ctx.enemies];
    enemies.length = 3;

    ctx.addToSteps(
      [0, 1, 2].map((i) => ({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemies[i].ID,
        damage: 2,
        isPiercing: false,
        element: EElement.Pyro,
      })),
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
