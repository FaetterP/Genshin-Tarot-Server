import { CardUseContext } from "../../../types/functionsContext";
import { Attack } from "../../../types/general";
import { Anemo } from "../../elements/Anemo";
import { Card } from "../Card";

export class FavoniusBladeworkPlus extends Card {
  public get Name(): string {
    return "FavoniusBladeworkPlus";
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
      },
      {
        type: "player_change_energy",
        playerId: ctx.player.ID,
        delta: 2,
      },
    ]);
    target.applyAttack({ damage: 2, player: ctx.player });
    ctx.player.addEnergy(2);
    ctx.player.addHealth(2);
  }
}
