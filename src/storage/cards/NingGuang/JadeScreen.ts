import { CardUseContext } from "../../../../types/functionsContext";
import { Card } from "../Card";

export class JadeScreen extends Card {
  public get Name(): string {
    return "JadeScreen";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addShield(3);
    } else {
      ctx.player.addShield(3);
    }
  }
}
