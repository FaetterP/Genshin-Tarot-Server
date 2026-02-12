import { CardUseContext } from "../../../types/functionsContext";
import { ECardType } from "../../../types/enums";
import { Card } from "../Card";
import { SignedEdictPlus } from "./SignedEdictPlus";

export class SignedEdict extends Card {
  public get Name(): string {
    return "SignedEdict";
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
