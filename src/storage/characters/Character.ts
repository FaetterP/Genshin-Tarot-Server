import { CharacterUseBurstContext } from "../../../types/functionsContext";
import { Card } from "../cards/Card";

export abstract class Character {
  private cards: Card[];
  
  constructor(cards: Card[]) {
    this.cards = cards;
  }

  abstract useBurst(ctx:CharacterUseBurstContext):void
}
