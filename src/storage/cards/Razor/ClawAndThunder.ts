import { CardUseContext } from "../../../types/functionsContext";
import { EElement, ETypeCard } from "../../../types/enums";
import { Electro } from "../../elements/Electro";
import { Card } from "../Card";
import { ClawAndThunderPlus } from "./ClawAndThunderPlus";

export class ClawAndThunder extends Card {
  public get Name(): string {
    return "ClawAndThunder";
  }

  constructor() {
    super(1, ETypeCard.Skill);
  }

  get Upgrade() {
    return ClawAndThunderPlus;
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: EElement.Electro,
      }))
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Electro(), ctx.player);
    }
    // TODO
  }
}
