import { CardUseContext } from "../../../types/functionsContext";
import { ECard, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { BalefulOmenPlus } from "./BalefulOmenPlus";

export class BalefulOmen extends Card {
  public get Name(): ECard {
    return ECard.BalefulOmen;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return BalefulOmenPlus;
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
