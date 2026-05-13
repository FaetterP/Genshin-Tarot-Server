import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class ForeignIronwindPlus extends Card {
  public get Name(): ECard {
    return ECard.ForeignIronwindPlus;
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

    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage,
        isPiercing: false,
        element: EElement.Anemo,
      },
      { type: EDetailedStep.PlayerStatChange, stat: "energy", playerId: ctx.player.ID, delta: 2 },
    ]);

    const attack: Attack = {
      damage,
      element: new Anemo(),
      player: ctx.player,
    };
    target.applyAttack(attack);
    ctx.player.addEnergy(2);
  }
}
