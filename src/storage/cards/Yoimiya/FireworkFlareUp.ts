import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { FireworkFlareUpPlus } from "./FireworkFlareUpPlus";

export class FireworkFlareUp extends Card {
  public get Name(): ECard {
    return ECard.FireworkFlareUp;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return FireworkFlareUpPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const attack: Attack = { damage: 2, isRange: true, player: ctx.player };
    ctx.enemies[0].applyAttack(attack);

    if (ctx.enemies[0].isContainsElement(EElement.Pyro)) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerChangeActionPoints,
          playerId: ctx.player.ID,
          delta: 1,
        },
      ]);
      ctx.player.addActionPoints(1);
    }
  }
}
