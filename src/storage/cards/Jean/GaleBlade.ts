import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { GaleBladePlus } from "./GaleBladePlus";

export class GaleBlade extends Card {
  public get Name(): ECard {
    return ECard.GaleBlade;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return GaleBladePlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) throw new Error("no enemies");

    if (ctx.enemies.length > 2) throw new Error("need 1-2 enemies");

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Anemo },
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 1,
        isPiercing: true,
        element: EElement.Anemo,
      },
    ]);
    target.applyAttack({
      damage: 1,
      isPiercing: true,
      element: new Anemo(),
      player: ctx.player,
    });
    if (ctx.enemies.length === 2) {
      const other = ctx.enemies[1];
      if (other === target) throw new Error("same enemies");
      if (!ctx.player.Enemies.includes(target)) throw new Error("first enemy must be in your zone");

      const ownerA = ctx.players.find((p) => p.Enemies.includes(target));
      const ownerB = ctx.players.find((p) => p.Enemies.includes(other));

      if (!ownerA || !ownerB) throw new Error("unknown enemy");
      ownerA.moveEnemyTo(ownerB, target);
      ownerB.moveEnemyTo(ownerA, other);
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemiesSwap,
          playerId: ctx.player.ID,
          enemyId1: target.ID,
          enemyId2: other.ID,
        },
      ]);
    }
  }
}
