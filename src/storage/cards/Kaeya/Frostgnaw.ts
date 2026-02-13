import { CardUseContext } from "../../../types/functionsContext";
import type { DetailedStep } from "../../../types/detailedStep";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { FrostgnawPlus } from "./FrostgnawPlus";

export class Frostgnaw extends Card {
  public get Name(): ECard {
    return ECard.Frostgnaw;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return FrostgnawPlus;
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      ...ctx.player.Enemies.map(
        (enemy): DetailedStep => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Cryo,
        }),
      ),
      {
        type: EDetailedStep.PlayerChangeEnergy,
        playerId: ctx.player.ID,
        delta: 1,
      },
    ]);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Cryo(), ctx.player);
    }
    ctx.player.addEnergy(1);
  }
}
