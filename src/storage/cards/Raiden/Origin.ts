import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { OriginPlus } from "./OriginPlus";

export class Origin extends Card {
  public get Name(): ECard {
    return ECard.Origin;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return OriginPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = { damage: 2, player: ctx.player };
    ctx.enemies[0].applyAttack(attack);

    if (ctx.isUseAlternative && ctx.player.trySpendEnergy(2)) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "actionPoints",
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addExtraActionPoints(1);
    }
  }
}
