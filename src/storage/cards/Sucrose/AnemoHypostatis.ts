import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { AnemoHypostatisPlus } from "./AnemoHypostatisPlus";

export class AnemoHypostatis extends Card {
  public get Name(): ECard {
    return ECard.AnemoHypostatis;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return AnemoHypostatisPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([{ type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Anemo }]);
    target.applyElement(new Anemo(), ctx.player);
    // TODO
  }
}
