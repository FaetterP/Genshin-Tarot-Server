import { ElementReactionContext } from "../../types/functionsContext";
import { EDetailedStep, EElement } from "../../types/enums";
import { Dash } from "../cards/misc/Dash";
import { BaseElement } from "./BaseElement";

export class Anemo extends BaseElement {
  public get Name() {
    return EElement.Anemo;
  }

  reaction(ctx: ElementReactionContext) {
    if (ctx.healTarget) {
      ctx.healTarget.addHealth(3);
      ctx.player.addSteps([{ type: EDetailedStep.PlayerHeal, playerId: ctx.healTarget.ID, amount: 3 }]);
    } else {
      ctx.player.addCardToDiscard(new Dash());
    }
  }
}
