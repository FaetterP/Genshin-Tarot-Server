import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { KaboomPlus } from "./KaboomPlus";

export class Kaboom extends Card {
  public get Name(): ECard {
    return ECard.Kaboom;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  get Upgrade() {
    return KaboomPlus;
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
        damage: 1,
        isPiercing: true,
        element: EElement.Pyro,
      },
      {
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: ctx.player.ID,
        delta: 1,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    });
    ctx.player.addEnergy(1);
  }
}
