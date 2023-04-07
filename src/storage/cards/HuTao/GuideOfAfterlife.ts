import { CardUseContext } from "../../../../types/functionsContext";
import { UseableCard } from "../UseableCard";

export class GuideOfAfterlife extends UseableCard {
  public get Name(): string {
    return "GuideOfAfterlife";
  }

  constructor() {
    super(1);
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
