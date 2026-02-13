import { CardUseContext } from "../../../types/functionsContext";
import { ECard, EDetailedStep, EElement, ECardType } from "../../../types/enums";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";
import { HeraldOfFrostPlus } from "./HeraldOfFrostPlus";

export class HeraldOfFrost extends Card {
  public get Name(): ECard {
    return ECard.HeraldOfFrost;
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return HeraldOfFrostPlus;
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    ctx.addToSteps([{ type: EDetailedStep.EnemyGetElement, enemyId: target.ID, element: EElement.Cryo }]);
    target.applyElement(new Cryo(), ctx.player);
    // TODO следующий, кто ударит этого же врага, отрегенит 2 хп
  }
}
