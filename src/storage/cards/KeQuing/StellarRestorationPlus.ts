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

    const targets = ctx.enemies.slice(0, 3);
    ctx.addToSteps([
      ...targets.map((t) => ({
        type: EDetailedStep.EnemyGetElement as const,
        enemyId: t.ID,
        element: EElement.Electro,
      })),
      {
        type: EDetailedStep.PlayerStatChange as const,
        stat: "energy" as const,
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    for (const target of targets) {
      target.applyElement(new Electro(), ctx.player);
    }
    ctx.player.addEnergy(2);
  }
}
