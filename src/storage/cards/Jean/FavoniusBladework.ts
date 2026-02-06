import { CardUseContext } from "../../../types/functionsContext";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";
import { FavoniusBladeworkPlus } from "./FavoniusBladeworkPlus";

export class FavoniusBladework extends Card {
  public get Name(): string {
    return "FavoniusBladework";
  }

  constructor() {
    super(1);
  }

  get Upgrade() {
    return FavoniusBladeworkPlus;
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
    if (target.isContainsElement(new Anemo())) {
      ctx.addToSteps([{
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      }]);
    }

    target.applyAttack({ damage: 2, player: ctx.player });
    if (target.isContainsElement(new Anemo())) {
      ctx.player.addEnergy(2);
    }
  }
}
