import { CardUseContext } from "../../../../types/functionsContext";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class IcetideVortex extends Card {
  public get Name(): string {
    return "IcetideVortex";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([
      { type: "enemy_get_element", enemyId: target.ID, element: "Cryo" },
    ]);
    target.applyElement(new Cryo(), ctx.player);
    // TODO
  }
}
