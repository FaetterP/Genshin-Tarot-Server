import { CardUseContext } from "../../../types/functionsContext";
import { ETypeCard } from "../../../types/enums";
import { Card } from "../Card";

export class BalefulOmenPlus extends Card {
  public get Name(): string {
    return "BalefulOmenPlus";
  }

  constructor() {
    super(1, ETypeCard.Skill);
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
