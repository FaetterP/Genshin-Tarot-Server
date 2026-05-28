import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class KaboomPlus extends Card {
  public get Name(): ECard {
    return ECard.KaboomPlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const spentEnergy = ctx.isUseAlternative && ctx.player.trySpendEnergy(2);
    const damage = spentEnergy ? 4 : 2;
    const steps: any[] = [
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: true,
        element: EElement.Pyro,
      },
      {
        type: EDetailedStep.EnemyGetElement,
        enemyId: target.ID,
        element: EElement.Pyro,
      },
    ];
    if (spentEnergy) {
      steps.push({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: ctx.player.ID,
        delta: -2,
      });
    }
    ctx.addToSteps(steps);
    target.applyAttack({
      damage,
      isPiercing: true,
      isRange: true,
      player: ctx.player,
    });
    target.applyElement(new Pyro(), ctx.player);
  }
}
