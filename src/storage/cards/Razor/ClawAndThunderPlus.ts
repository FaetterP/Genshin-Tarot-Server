import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";

export class ClawAndThunderPlus extends Card {
  public get Name(): ECard {
    return ECard.ClawAndThunderPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
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

    // TODO: skip if burst was activated this turn
    if (ctx.player.razorPoints < 3) {
      ctx.player.razorPoints += 1;
      ctx.addToSteps([{
        type: EDetailedStep.PlayerStatChange,
        stat: "razorPoints",
        playerId: ctx.player.ID,
        delta: 1,
      }]);
    }

    if (ctx.isUseAlternative && ctx.player.razorPoints > 0) {
      const points = ctx.player.razorPoints;
      ctx.player.razorPoints = 0;
      ctx.addToSteps([{
        type: EDetailedStep.PlayerStatChange,
        stat: "razorPoints",
        playerId: ctx.player.ID,
        delta: -points,
      }]);
      ctx.player.addEnergy(points * 2);
      ctx.addToSteps([{
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: ctx.player.ID,
        delta: points * 2,
      }]);
    }
  }
}
