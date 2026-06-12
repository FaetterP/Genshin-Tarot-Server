import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { removeDuplicates } from "../../../utils/arrays";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class WindSpiritCreationPlus extends Card {
  public get Name(): ECard {
    return ECard.WindSpiritCreationPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const enemies = removeDuplicates(ctx.enemies);
    if (enemies.length < 2) {
      throw new Error("need 2 different enemies");
    }
    if (enemies.length > 2) {
      throw new Error("too many enemies");
    }

    ctx.addToSteps(
      [0, 1].flatMap((i) => [
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: enemies[i].ID,
          damage: 2,
          isPiercing: true,
          element: EElement.Anemo,
        },
        {
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemies[i].ID,
          element: EElement.Anemo,
        },
      ]),
    );
    for (let i = 0; i < 2; i++) {
      enemies[i].applyAttack({
        damage: 2,
        isPiercing: true,
        isRange: true,
        player: ctx.player,
      });
      enemies[i].applyElement(new Anemo(), ctx.player);
    }
  }
}
