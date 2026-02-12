import { CardUseContext } from "../../../types/functionsContext";
import { EElement, ETypeCard } from "../../../types/enums";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class AnemoHypostatisPlus extends Card {
  public get Name(): string {
    return "AnemoHypostatisPlus";
  }

  constructor() {
    super(1, ETypeCard.Skill);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps(
      ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: EElement.Anemo,
      }))
    );
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Anemo(), ctx.player);
    }
    // TODO
  }
}
