import { CardUseContext } from "../../../types/functionsContext";
import { ECard, ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class BalefulOmenPlus extends Card {
  public get Name(): ECard {
    return ECard.BalefulOmenPlus;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
