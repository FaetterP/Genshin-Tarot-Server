import { CardUseContext } from "../../../../types/functionsContext";
import { Attack } from "../../../../types/general";
import { Pyro } from "../../elements/Pyro";
import { Card } from "../Card";

export class KaboomPlus extends Card {
  public get Name(): string {
    return "KaboomPlus";
  }

  constructor() {
    super(1);
  }

  use(ctx: CardUseContext): void {
    if (!ctx.enemies?.length) {
      throw new Error("no enemies");
    }

    const target = ctx.enemies[0];
    const damage =
      ctx.isUseAlternative && ctx.player.trySpendEnergy(2) ? 4 : 2;
    ctx.addToSteps([
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage,
        isPiercing: true,
        element: "Pyro",
      },
    ]);
    target.applyAttack({
      damage,
      isPiercing: true,
      isRange: true,
      element: new Pyro(),
      player: ctx.player,
    });
  }
}
