import { CardUseContext } from "../../../types/functionsContext";
import { Hydro } from "../../elements/Hydro";
import { Card } from "../Card";
import { GuhuaStylePlus } from "./GuhuaStylePlus";

export class GuhuaStyle extends Card {
  public get Name(): string {
    return "GuhuaStyle";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return GuhuaStylePlus;
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
      },
    ]);
    if (target.isContainsElement(new Hydro())) {
      ctx.addToSteps([{
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      }]);
    }

    target.applyAttack({ damage: 2, player: ctx.player });
    if (target.isContainsElement(new Hydro())) {
      ctx.player.addEnergy(2);
    }
  }
}
