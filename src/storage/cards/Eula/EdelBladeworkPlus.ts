import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Cryo } from "../../elements/Cryo";
import { Card } from "../Card";

export class EdelBladeworkPlus extends Card {
  public get Name(): string {
    return "EdelBladeworkPlus";
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
      {
        type: "enemy_take_damage",
        enemyId: target.ID,
        damage: 2,
        isPiercing: false,
        element: "Cryo",
      },
    ]);
    target.applyAttack({
      damage: 2,
      element: new Cryo(),
      player: ctx.player,
    });
    // TODO
  }
}
