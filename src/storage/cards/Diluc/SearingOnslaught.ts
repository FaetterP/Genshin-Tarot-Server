import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { SearingOnslaughtPlus } from "./SearingOnslaughtPlus";

export class SearingOnslaught extends Card {
  public get Name(): ECard {
    return ECard.SearingOnslaught;
  }

  constructor() {
    super(2, ECardType.Skill);
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
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemies[i].ID,
        damage: 2,
        isPiercing: false,
        element: EElement.Pyro,
      })),
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
