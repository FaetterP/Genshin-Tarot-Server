import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { ChihayaburuPlus } from "./ChihayaburuPlus";

export class Chihayaburu extends Card {
  public get Name(): ECard {
    return ECard.Chihayaburu;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return ChihayaburuPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) throw new Error("no enemies");

    if (ctx.enemies.length > 2) throw new Error("need 1-2 enemies");

    const target = ctx.enemies[0];

    if (ctx.enemies.length === 2) {
      const other = ctx.enemies[1];
      if (other === target) throw new Error("same enemies");
      const ownerA = ctx.players.find((p) => p.Enemies.includes(target));
      const ownerB = ctx.players.find((p) => p.Enemies.includes(other));
      if (!ownerA || !ownerB) throw new Error("unknown enemy");
    }

    ctx.addToSteps([
      { type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Anemo },
    ]);
    target.applyElement(new Anemo(), ctx.player);

    if (ctx.enemies.length === 2) {
      const other = ctx.enemies[1];
      const ownerA = ctx.players.find((p) => p.Enemies.includes(target))!;
      const ownerB = ctx.players.find((p) => p.Enemies.includes(other))!;

      ctx.addToSteps([
        { type: EDetailedStep.EnemyGetElement, enemyId: other.ID, element: EElement.Anemo },
      ]);
      other.applyElement(new Anemo(), ctx.player);

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
