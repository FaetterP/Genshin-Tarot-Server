import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class LayeredFrost extends Card {
  public get Name(): string {
    return "LayeredFrost";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    ctx.player.drawCard();
    // TODO
  }
}
