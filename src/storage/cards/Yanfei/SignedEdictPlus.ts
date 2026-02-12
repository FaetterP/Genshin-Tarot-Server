import { CardUseContext } from "../../../types/functionsContext";
import { ETypeCard } from "../../../types/enums";
import { Card } from "../Card";

export class SignedEdictPlus extends Card {
  public get Name(): string {
    return "SignedEdictPlus";
  }

  constructor() {
    super(1, ETypeCard.Skill);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
