import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { EElement, ETypeCard } from "../../../types/enums";
import { removeDuplicates } from "../../../utils/arrays";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class JumpyDumptyPlus extends Card {
  public get Name(): string {
    return "JumpyDumptyPlus";
  }

  constructor() {
    super(1, ETypeCard.Skill);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const enemies = removeDuplicates(ctx.enemies);
    if (enemies.length <= 2) {
      throw new Error("need 2 different enemies");
    }

    ctx.addToSteps(
      [0, 1].map((i) => ({
        type: "enemy_take_damage" as const,
        enemyId: enemies[i].ID,
        damage: 2,
        isPiercing: false,
        element: EElement.Pyro,
      })),
    );
    for (let i = 0; i < 2; i++) {
      enemies[i].applyAttack({
        damage: 2,
        element: new Pyro(),
        player: ctx.player,
      });
    }

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      ctx.addToSteps(
        [0, 1].map((i) => ({
          type: "enemy_take_damage" as const,
          enemyId: enemies[i].ID,
          damage: 2,
          isPiercing: false,
          element: EElement.Pyro,
        })),
      );
      for (let i = 0; i < 2; i++) {
        enemies[i].applyAttack({
          damage: 2,
          element: new Pyro(),
          player: ctx.player,
        });
      }
    }
  }
}
