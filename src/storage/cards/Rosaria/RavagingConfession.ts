import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, ECardType, EElement } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { RavagingConfessionPlus } from "./RavagingConfessionPlus";

export class RavagingConfession extends Card {
  public get Name(): ECard {
    return ECard.RavagingConfession;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return RavagingConfessionPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const zonePlayer = ctx.players.find((p) => p.Enemies.includes(target));
    if (!zonePlayer) throw new Error("enemy not in any zone");

    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyGetElement,
        enemyId: target.ID,
        element: EElement.Cryo,
      },
    ]);
    target.applyElement(new Cryo(), ctx.player);

    const zoneEnemies = [...zonePlayer.Enemies];
    for (const enemy of zoneEnemies) {
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: enemy.ID,
          damage: 1,
          isPiercing: false,
        },
      ]);
      enemy.applyAttack({ damage: 1, isRange: true, player: ctx.player });
    }
  }
}
