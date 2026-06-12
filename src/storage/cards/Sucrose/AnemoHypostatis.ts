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
    if (!ctx.enemies?.length) throw new Error("no enemies");
    if (ctx.enemies.length > 2) throw new Error("need 1-2 enemies");

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Anemo },
    ]);
    target.applyElement(new Anemo(), ctx.player);

    if (ctx.enemies.length === 2) {
      const flipTarget = ctx.enemies[1];
      if (flipTarget === target) throw new Error("same enemies");
      const coverOwner = ctx.players.find((p) => p.Enemies.includes(target))!;
      coverOwner.flipEnemyFaceDown(flipTarget, target);
    }
  }
}
