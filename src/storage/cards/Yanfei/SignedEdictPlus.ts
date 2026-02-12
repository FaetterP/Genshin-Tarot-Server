import { CardUseContext } from "../../../types/functionsContext";
import { ECardType } from "../../../types/enums";
import { Card } from "../Card";

export class SignedEdictPlus extends Card {
  public get Name(): string {
    return "SignedEdictPlus";
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
