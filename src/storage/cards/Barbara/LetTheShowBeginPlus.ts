import { CardUseContext } from "../../../types/functionsContext";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { LetTheShowBeginPlusEffect } from "../../effects/LetTheShowBeginPlusEffect";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";

export class LetTheShowBeginPlus extends Card {
  public get Name(): ECard {
    return ECard.LetTheShowBeginPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.ID,
        element: EElement.Hydro,
      })),
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Hydro(), ctx.player);
    }

    const effect = new LetTheShowBeginPlusEffect();
    ctx.addToSteps([
      {
        type: EDetailedStep.PlayerGetEffect,
        playerId: ctx.player.ID,
        effect: effect.Name,
      },
    ]);
    ctx.player.addEffect(effect);
  }
}
