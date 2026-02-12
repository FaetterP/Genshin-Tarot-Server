import { CardUseContext } from "../../../types/functionsContext";
import { ETypeCard } from "../../../types/enums";
import { Card } from "../Card";
import { SignedEdictPlus } from "./SignedEdictPlus";

export class SignedEdict extends Card {
  public get Name(): string {
    return "SignedEdict";
  }

  constructor() {
    super(1, ETypeCard.Skill);
  }

  get Upgrade() {
    return SignedEdictPlus;
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
