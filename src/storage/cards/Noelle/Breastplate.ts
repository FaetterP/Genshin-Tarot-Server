import { CardUseContext } from "../../../types/functionsContext";
import { EElement, ECardType } from "../../../types/enums";
import { Geo } from "../../elements/Geo";
import { Card } from "../Card";
import { BreastplatePlus } from "./BreastplatePlus";

export class Breastplate extends Card {
  public get Name(): string {
    return "Breastplate";
  }

  constructor() {
    super(1, ECardType.Skill);
  }

  get Upgrade() {
    return BreastplatePlus;
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: EElement.Geo,
      })),
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Geo(), ctx.player);
    }
    ctx.player.addHealth(1);
  }
}
