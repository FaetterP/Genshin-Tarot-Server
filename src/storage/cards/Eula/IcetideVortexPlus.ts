import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class IcetideVortexPlus extends Card {
  public get Name(): ECard {
    return ECard.IcetideVortexPlus;
  }

  constructor() {
    super(0, ECardType.Skill);
  }

  private static readonly EULA_CARD_NAMES = [
    "EdelBladework",
    "EdelBladeworkPlus",
    "IcetideVortex",
    "IcetideVortexPlus",
  ];

  use(ctx: CardUseContext): void {
    if (ctx.isUseAlternative) {
      const isEulaCard = (c: { Name: string }) =>
        IcetideVortexPlus.EULA_CARD_NAMES.includes(c.Name);
      const deck = ctx.player.Deck;
      const fromDeck = deck.find(isEulaCard);
      if (fromDeck) {
        ctx.player.removeFromDeck(fromDeck);
        ctx.player.addCardToHand(fromDeck, false);
        ctx.addToSteps([
          {
            type: EDetailedStep.AddCard,
            playerId: ctx.player.ID,
            card: fromDeck.getPrimitive(),
            to: "hand",
          },
        ]);
      } else {
        const fromDiscard = ctx.player.Discard.filter(isEulaCard);
        for (const c of fromDiscard) {
          ctx.player.removeFromDiscard(c);
          ctx.player.addCardToHand(c, true);
          ctx.addToSteps([
            {
              type: EDetailedStep.AddCard,
              playerId: ctx.player.ID,
              card: c.getPrimitive(),
              to: "hand",
            },
          ]);
        }
      }
      return;
    }

    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([{ type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Cryo }]);
    target.applyElement(new Cryo(), ctx.player);
  }
}
