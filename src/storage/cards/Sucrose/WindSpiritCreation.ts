import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { WindSpiritCreationPlus } from "./WindSpiritCreationPlus";

export class WindSpiritCreation extends Card {
  public get Name(): ECard {
    return ECard.WindSpiritCreation;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return WindSpiritCreationPlus;
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
        damage: 1,
        isPiercing: true,
        element: EElement.Anemo,
      },
      {
        type: EDetailedStep.PlayerChangeEnergy,
        playerId: ctx.player.ID,
        delta: 1,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Anemo(),
      player: ctx.player,
    });
    ctx.player.addEnergy(1);
  }
}
