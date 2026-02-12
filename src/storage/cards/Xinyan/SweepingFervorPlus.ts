import { CardUseContext } from "../../../types/functionsContext";
import { EElement, ETypeCard } from "../../../types/enums";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class SweepingFervorPlus extends Card {
  public get Name(): string {
    return "SweepingFervorPlus";
  }

  constructor() {
    super(0, ETypeCard.Skill);
  }

  use(ctx: CardUseContext): void {
    ctx.addToSteps([
      {
        type: "player_change_shield",
        playerId: ctx.player.ID,
        delta: 3,
      },
      ...ctx.player.Enemies.map((enemy) => ({
        type: "enemy_get_element" as const,
        enemyId: enemy.ID,
        element: EElement.Pyro,
      })),
    ]);
    ctx.player.addShield(3);
    for (const enemy of ctx.player.Enemies) {
      enemy.applyElement(new Pyro(), ctx.player);
    }
  }
}
