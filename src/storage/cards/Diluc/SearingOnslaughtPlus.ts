import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class SearingOnslaughtPlus extends Card {
  public get Name(): ECard {
    return ECard.SearingOnslaughtPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const attack: Attack = { damage: 2, element: new Pyro(), player: ctx.player };

    for (let i = 0; i < 3; i++) {
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: target.ID,
          damage: 2,
          isPiercing: false,
          element: EElement.Pyro,
        },
      ]);
      target.applyAttack(attack);
    }
  }
}
