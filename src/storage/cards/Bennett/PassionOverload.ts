import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";
import { PassionOverloadPlus } from "./PassionOverloadPlus";

const BENNETT_CARD_NAMES = new Set([
  "PassionOverload",
  "PassionOverloadPlus",
  "StrikeOfFortune",
  "StrikeOfFortunePlus",
]);

export class PassionOverload extends Card {
  public get Name(): string {
    return "PassionOverload";
  }

  constructor() {
    super(1);
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
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 2,
        isPiercing: false,
        element: "Pyro",
      },
    ]);
    target.applyAttack(attack);

    const topCard = ctx.player.findTopCardFromDeck();
    if (topCard) {
      const isBurn = topCard.Name === "Burn";
      const isBennettCard = BENNETT_CARD_NAMES.has(topCard.Name);

      if (isBurn) {
        ctx.addToSteps([
          { type: "trash_card", playerId: ctx.player.ID, card: topCard.getPrimitive() },
        ]);
      } else {
        ctx.player.addCardToDiscard(topCard);
        ctx.addToSteps([
          { type: "discard_card", playerId: ctx.player.ID, card: topCard.getPrimitive() },
        ]);
      }

      if (isBurn || isBennettCard) {
        ctx.player.applyDamage(1, true);
        ctx.addToSteps([
          {
            type: "player_take_damage",
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
              type: "enemy_take_damage",
              enemyId: enemy.ID,
              damage: 1,
              isPiercing: false,
              element: "Pyro",
            },
          ]);
          enemy.applyAttack(aoeAttack);
        }
      }
    }
  }
}
