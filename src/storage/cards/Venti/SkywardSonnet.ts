import { CardUseContext } from "../../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { UseableCard } from "../UseableCard";

export class SkywardSonnet extends UseableCard {
  public get Name(): string {
    return "SkywardSonnet";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }

    // TODO next attack +1 damage
  }
}
