import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class FavoniusBladeworkPlus extends Card {
  public get Name(): ECard {
    return ECard.FavoniusBladeworkPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
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
      {
        type: EDetailedStep.PlayerChangeEnergy,
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    target.applyAttack({ damage: 2, player: ctx.player });
    ctx.player.addEnergy(2);
    ctx.player.addHealth(2);
  }
}
