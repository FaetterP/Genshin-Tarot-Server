import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class ForeignRockbladePlus extends Card {
  public get Name(): ECard {
    return ECard.ForeignRockbladePlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage = 3;
    const energyDelta = 2;

    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element: EElement.Geo,
      },
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: ctx.player.ID,
        delta: energyDelta,
      },
    ]);

    const attack: Attack = {
      damage,
      element: new Geo(),
      player: ctx.player,
    };
    target.applyAttack(attack);

    ctx.player.addEnergy(energyDelta);
  }
}
