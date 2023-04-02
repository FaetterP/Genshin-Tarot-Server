import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class JadeScreenPlus extends UseableCard {
  public get Name(): string {
    return "JadeScreenPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (ctx.selectedPlayer) {
      ctx.selectedPlayer.addShield(3);
      ctx.player.addEnergy(1);
    }

    ctx.player.addShield(3);
    ctx.player.addEnergy(1);
  }
}
