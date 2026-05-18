import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { FavoniusBladeworkPlus } from "./FavoniusBladeworkPlus";

export class FavoniusBladework extends Card {
  public get Name(): ECard {
    return ECard.FavoniusBladework;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return FavoniusBladeworkPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 2,
        isPiercing: false,
      },
    ]);
    if (target.isContainsElement(EElement.Anemo)) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: 2,
        },
      ]);
    }

    target.applyAttack({ damage: 2, player: ctx.player });
    if (target.isContainsElement(EElement.Anemo)) {
      ctx.player.addEnergy(2);
    }
  }
}
