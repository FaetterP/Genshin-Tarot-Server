import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { SolarIsotomaEffect } from "../../effects/SolarIsotomaEffect";
import { Card } from "../Card";

export class WeissBladeworkPlus extends Card {
  public get Name(): ECard {
    return ECard.WeissBladeworkPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = { damage: 3, player: ctx.player };
    ctx.enemies[0].applyAttack(attack);

    if (ctx.player.isContainsEffect(new SolarIsotomaEffect())) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addExtraActionPoints(1);
      ctx.player.drawCard();
    }
  }
}
