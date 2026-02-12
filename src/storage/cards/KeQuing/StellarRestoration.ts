import { CardUseContext } from "../../../types/functionsContext";
import { EElement, ECardType } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { StellarRestorationPlus } from "./StellarRestorationPlus";

export class StellarRestoration extends Card {
  public get Name(): string {
    return "StellarRestoration";
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return StellarRestorationPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([{ type: "enemy_get_element", enemyId: target.ID, element: EElement.Electro }]);
    target.applyElement(new Electro(), ctx.player);
    // TODO
  }
}
