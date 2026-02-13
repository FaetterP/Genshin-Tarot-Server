import { CardUseContext } from "../../../types/functionsContext";
import { ECard, ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { SignedEdictPlus } from "./SignedEdictPlus";

export class SignedEdict extends Card {
  public get Name(): ECard {
    return ECard.SignedEdict;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return SignedEdictPlus;
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
