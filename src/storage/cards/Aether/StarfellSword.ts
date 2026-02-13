import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "../Card";
import { StarfellSwordPlus } from "./StarfellSwordPlus";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Geo } from "../../elements/Geo";

export class StarfellSword extends Card {
  public get Name(): ECard {
    return ECard.StarfellSword;
  }

  constructor() {
    super(2, ECardType.Skill);
  }

  get Upgrade() {
    return StarfellSwordPlus;
  }

  use(ctx: CardUseContext): void {
    const damage = 2;

    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.ID,
        damage,
        isPiercing: true,
        element: EElement.Geo,
      })),
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
