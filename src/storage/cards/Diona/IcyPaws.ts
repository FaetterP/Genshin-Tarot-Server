import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { IcyPawsPlus } from "./IcyPawsPlus";

export class IcyPaws extends Card {
  public get Name(): ECard {
    return ECard.IcyPaws;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return IcyPawsPlus;
  }

  use(ctx: CardUseContext): void {
    if (ctx.isUseAlternative) {
      ctx.addToSteps(
        ctx.player.Enemies.map((enemy) => ({
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Cryo,
        })),
      );
      for (const enemy of ctx.player.Enemies) {
        enemy.applyElement(new Cryo(), ctx.player);
      }
      const burnInDiscard = ctx.player.Discard.find((c) => c.Name === ECard.Burn);
      if (burnInDiscard) {
        ctx.player.trashCardById(burnInDiscard.ID);
      }
    } else {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerChangeShield,
          playerId: ctx.player.ID,
          delta: 3,
        },
      ]);
      ctx.player.addShield(3);
    }
  }
}
