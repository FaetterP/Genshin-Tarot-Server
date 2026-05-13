import type { DetailedStep } from "../../../types/detailedStep";
import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class AncientSwordArtPlus extends Card {
  public get Name(): ECard {
    return ECard.AncientSwordArtPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const hasCryo = target.isContainsElement(EElement.Cryo);
    const damage = hasCryo ? 5 : 2;
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element: hasCryo ? EElement.Cryo : undefined,
      },
    ]);
    if (!hasCryo) {
      ctx.addToSteps([
        {
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: 2,
        },
      ]);
    }
    if (hasCryo) {
      target.applyAttack({ damage: 5, element: new Cryo(), player: ctx.player });
    } else {
      target.applyAttack({ damage: 2, player: ctx.player });
      ctx.player.addEnergy(2);
    }
  }
}
