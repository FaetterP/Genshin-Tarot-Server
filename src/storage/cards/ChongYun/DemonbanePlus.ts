import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class DemonbanePlus extends Card {
  public get Name(): ECard {
    return ECard.DemonbanePlus;
  }

  constructor() {
    super(1, ECardType.Attack);
  }

  use(ctx: CardUseContext): void {
    if (ctx.isUseAlternative) {
      if (!ctx.enemies?.length) {
        throw new Error("no enemies");
      }
      const target = ctx.enemies[0];
      if (!target.isContainsElement(EElement.Cryo)) {
        throw new Error("no cryo");
      }
      ctx.addToSteps([
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: target.ID,
          damage: 4,
          isPiercing: false,
          element: EElement.Cryo,
        },
      ]);
      target.applyAttack({
        damage: 4,
        element: new Cryo(),
        player: ctx.player,
      });
    } else {
      ctx.addToSteps(
        ctx.player.Enemies.map((enemy) => ({
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: enemy.ID,
          damage: 2,
          isPiercing: false,
        })),
      );
      for (const enemy of ctx.player.Enemies) {
        enemy.applyAttack({ damage: 2, player: ctx.player });
      }
    }
  }
}
