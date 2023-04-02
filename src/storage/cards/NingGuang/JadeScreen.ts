import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class JadeScreen extends UseableCard {
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
