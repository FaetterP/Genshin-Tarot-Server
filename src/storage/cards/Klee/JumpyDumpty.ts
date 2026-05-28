import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { removeDuplicates } from "../../../utils/arrays";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { JumpyDumptyPlus } from "./JumpyDumptyPlus";

export class JumpyDumpty extends Card {
  public get Name(): ECard {
    return ECard.JumpyDumpty;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return JumpyDumptyPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const enemies = removeDuplicates(ctx.enemies);
    if (enemies.length < 2) {
      throw new Error("need 2 different enemies");
    }

    for (let i = 0; i < 2; i++) {
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: enemies[i].ID,
          damage: 1,
          isPiercing: false,
          element: EElement.Pyro,
        },
        {
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemies[i].ID,
          element: EElement.Pyro,
        },
      ]);
    }
    for (let i = 0; i < 2; i++) {
      enemies[i].applyAttack({ damage: 1, player: ctx.player });
      enemies[i].applyElement(new Pyro(), ctx.player);
    }

    if (ctx.isUseAlternative) {
      ctx.player.moveCardFromHandToDeck(this, false, true);
    }
  }
}
