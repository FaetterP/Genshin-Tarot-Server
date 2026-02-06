import { CardUseContext } from "../../../types/functionsContext";
import { Card } from "../Card";
import { BalefulOmenPlus } from "./BalefulOmenPlus";

export class BalefulOmen extends Card {
  public get Name(): string {
    return "BalefulOmen";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return BalefulOmenPlus;
  }

  use(ctx: CardUseContext): void {
    // TODO
  }
}
