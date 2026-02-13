import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { ClawAndThunderPlus } from "./ClawAndThunderPlus";

export class ClawAndThunder extends Card {
  public get Name(): ECard {
    return ECard.ClawAndThunder;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return ClawAndThunderPlus;
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.ID,
        element: EElement.Electro,
      })),
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Electro(), ctx.player);
    }
    // TODO
  }
}
