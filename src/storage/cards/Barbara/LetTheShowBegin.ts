import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { LetTheShowBeginPlus } from "./LetTheShowBeginPlus";

export class LetTheShowBegin extends Card {
  public get Name(): ECard {
    return ECard.LetTheShowBegin;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return LetTheShowBeginPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    if (!ctx.selectedPlayer) {
      throw new Error("no selected player");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Hydro },
    ]);
    target.applyElement(new Hydro(), ctx.player);

    let healCount = 1;
    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      healCount = 3;
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: -2,
        },
      ]);
    }

    ctx.selectedPlayer.addHealth(healCount);
    ctx.addToSteps([
      { type: EDetailedStep.PlayerHeal, playerId: ctx.selectedPlayer.ID, amount: healCount },
    ]);
  }
}
