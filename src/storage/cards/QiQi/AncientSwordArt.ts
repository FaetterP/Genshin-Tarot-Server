import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { AncientSwordArtPlus } from "./AncientSwordArtPlus";

export class AncientSwordArt extends Card {
  public get Name(): ECard {
    return ECard.AncientSwordArt;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return AncientSwordArtPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 2,
        isPiercing: false,
      },
    ]);
    if (target.isContainsElement(EElement.Cryo)) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: 2,
        },
      ]);
    }
    target.applyAttack({ damage: 2, player: ctx.player });
    if (target.isContainsElement(EElement.Cryo)) {
      ctx.player.addEnergy(2);
    }
  }
}
