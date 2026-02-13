import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { PassionOverloadPlus } from "./PassionOverloadPlus";

const BENNETT_CARD_NAMES = new Set<ECard>([
  ECard.PassionOverload,
  ECard.PassionOverloadPlus,
  ECard.StrikeOfFortune,
  ECard.StrikeOfFortunePlus,
]);

export class PassionOverload extends Card {
  public get Name(): ECard {
    return ECard.PassionOverload;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return PassionOverloadPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const attack: Attack = {
      damage: 2,
      element: new Pyro(),
      player: ctx.player,
    };

    ctx.addToSteps([
      {
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: target.ID,
        damage: 2,
        isPiercing: false,
        element: EElement.Pyro,
      },
    ]);
    target.applyAttack(attack);

    const topCard = ctx.player.findTopCardFromDeck();
    if (topCard) {
      const isBurn = topCard.Name === ECard.Burn;
      const isBennettCard = BENNETT_CARD_NAMES.has(topCard.Name);

      if (isBurn) {
        ctx.addToSteps([
          { type: EDetailedStep.TrashCard, playerId: ctx.player.ID, card: topCard.getPrimitive() },
        ]);
      } else {
        ctx.player.addCardToDiscard(topCard);
        ctx.addToSteps([
          { type: EDetailedStep.DiscardCard, playerId: ctx.player.ID, card: topCard.getPrimitive() },
        ]);
      }

      if (isBurn || isBennettCard) {
        ctx.player.applyDamage(1, true);
        ctx.addToSteps([
          {
            type: EDetailedStep.PlayerTakeDamage,
            playerId: ctx.player.ID,
            damage: 1,
            isPiercing: true,
          },
        ]);
        const aoeAttack: Attack = {
          damage: 1,
          element: new Pyro(),
          player: ctx.player,
        };
        for (const enemy of ctx.player.Enemies) {
          ctx.addToSteps([
            {
              type: EDetailedStep.EnemyTakeDamage,
              enemyId: enemy.ID,
              damage: 1,
              isPiercing: false,
              element: EElement.Pyro,
            },
          ]);
          enemy.applyAttack(aoeAttack);
        }
      }
    }
  }
}
