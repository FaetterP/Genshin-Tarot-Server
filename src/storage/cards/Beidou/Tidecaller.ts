import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { TidecallerPlus } from "./TidecallerPlus";

export class Tidecaller extends Card {
  public get Name(): ECard {
    return ECard.Tidecaller;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return TidecallerPlus;
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Electro,
        }),
      ),
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Electro(), ctx.player);
    }
    ctx.player.addShield(2);
  }
}
