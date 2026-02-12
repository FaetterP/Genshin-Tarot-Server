import { CardUseContext } from "../../../types/functionsContext";
import { EElement, ETypeCard } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { HeraldOfFrostPlus } from "./HeraldOfFrostPlus";

export class HeraldOfFrost extends Card {
  public get Name(): string {
    return "HeraldOfFrost";
  }

  constructor() {
    super(1, ETypeCard.Skill);
  }

  get Upgrade() {
    return HeraldOfFrostPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([{ type: "enemy_get_element", enemyId: target.ID, element: EElement.Cryo }]);
    target.applyElement(new Cryo(), ctx.player);
    // TODO следующий, кто ударит этого же врага, отрегенит 2 хп
  }
}
