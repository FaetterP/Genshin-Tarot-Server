import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";
import { WeissBladeworkPlus } from "./WeissBladeworkPlus";

export class WeissBladework extends Card {
  public get Name(): ECard {
    return ECard.WeissBladework;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return WeissBladeworkPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 2;

    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: false,
      },
    ]);
    if (target.isContainsElement(EElement.Geo)) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerChangeEnergy,
          playerId: ctx.player.ID,
          delta: 2,
        },
      ]);
    }

    const attack: Attack = { damage, player: ctx.player };
    target.applyAttack(attack);
    if (target.isContainsElement(EElement.Geo)) {
      ctx.player.addEnergy(2);
    }
  }
}
