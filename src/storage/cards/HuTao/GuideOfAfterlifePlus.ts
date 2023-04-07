import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class GuideOfAfterlifePlus extends UseableCard {
  public get Name(): string {
    return "GuideOfAfterlifePlus";
  }

  constructor() {
    super(0);
  }

  use(ctx: CardUseContext): void {
    ctx.player.applyDamage(1)
    // TODO or
    ctx.player.addEnergy(1)
    ctx.player.drawCard()
    ctx.player.drawCard()

    // TODO
  }
}
