import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";

export class StarfellSwordPlus extends Card {
  public get Name(): ECard {
    return ECard.StarfellSwordPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    const damage = 2;

    ctx.addToSteps(
      ctx.player.Enemies.flatMap((enemy) => [
        {
          type: EDetailedStep.EnemyTakeDamage,
          enemyId: enemy.ID,
          damage,
          isPiercing: true,
          element: EElement.Geo,
        },
        {
          type: EDetailedStep.EnemyGetElement,
          enemyId: enemy.ID,
          element: EElement.Geo,
        },
      ]),
    );

    for (const enemy of ctx.player.Enemies) {
      const attack: Attack = {
        damage,
        isPiercing: true,
        element: new Geo(),
        player: ctx.player,
      };

      enemy.applyAttack(attack);
    }
  }
}
