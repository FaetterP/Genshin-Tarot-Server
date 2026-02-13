import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
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
    if (enemies.length <= 2) {
      throw new Error("need 2 different enemies");
    }

    ctx.addToSteps(
      [0, 1].map((i) => ({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemies[i].ID,
        damage: 1,
        isPiercing: false,
        element: EElement.Pyro,
      })),
    );
    for (let i = 0; i < 2; i++) {
      const attack: Attack = {
        damage: 1,
        element: new Pyro(),
        player: ctx.player,
      };
      enemies[i].applyAttack(attack);
    }

    if (ctx.isUseAlternative) {
      // TODO place card to top of deck
    }
  }
}
