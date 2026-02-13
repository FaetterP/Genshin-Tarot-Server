import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { FatalRainscreenPlus } from "./FatalRainscreenPlus";

export class FatalRainscreen extends Card {
  public get Name(): ECard {
    return ECard.FatalRainscreen;
  }

  constructor() {
    super(2, ECardType.Skill);
  }

  get Upgrade() {
    return FatalRainscreenPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Hydro },
      {
        type: EDetailedStep.PlayerChangeShield,
        playerId: ctx.player.ID,
        delta: 4,
      },
    ]);
    target.applyElement(new Hydro(), ctx.player);
    ctx.player.addShield(4);
    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addHealth(2);
    }
  }
}
