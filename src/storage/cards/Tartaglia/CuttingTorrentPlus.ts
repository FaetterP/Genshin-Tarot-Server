import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";

export class CuttingTorrentPlus extends Card {
  public get Name(): ECard {
    return ECard.CuttingTorrentPlus;
  }

  constructor() {
    super(0, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const hasHydro = target.isContainsElement(EElement.Hydro);
    const damage = hasHydro ? 3 : 1;
    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: true,
        element: hasHydro ? EElement.Hydro : undefined,
      },
    ]);
    const attack: Attack = {
      damage,
      isRange: true,
      isPiercing: true,
      player: ctx.player,
    };
    target.applyAttack(attack);
    if (hasHydro) {
      const energyBefore = ctx.player.Energy;
      target.applyElement(new Hydro(), ctx.player);
      const energyDelta = ctx.player.Energy - energyBefore;
      if (energyDelta !== 0) {
        ctx.addToSteps([{
          type: EDetailedStep.PlayerStatChange,
          stat: "energy",
          playerId: ctx.player.ID,
          delta: energyDelta,
        }]);
      }
    }
  }
}
