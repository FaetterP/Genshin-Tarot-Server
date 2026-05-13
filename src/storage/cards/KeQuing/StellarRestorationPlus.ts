import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class StellarRestorationPlus extends Card {
  public get Name(): ECard {
    return ECard.StellarRestorationPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Electro },
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Electro },
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Electro },
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    for (let i = 0; i < 3; i++) {
      target.applyElement(new Electro(), ctx.player);
    }
    ctx.player.addEnergy(2);
  }
}
